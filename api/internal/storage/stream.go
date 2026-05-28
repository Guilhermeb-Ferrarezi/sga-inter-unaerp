package storage

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type StreamClient struct {
	accountID string
	token     string
	http      *http.Client
}

type StreamVideo struct {
	UID          string `json:"uid"`
	ThumbnailURL string `json:"thumbnail"`
	PlaybackURL  string `json:"playback"`
}

func NewStream(accountID, token string) *StreamClient {
	return &StreamClient{
		accountID: accountID,
		token:     token,
		http:      &http.Client{Timeout: 30 * time.Second},
	}
}

// GetEmbedToken returns a short-lived signed token for embedding a video.
func (s *StreamClient) GetEmbedToken(ctx context.Context, videoUID string) (string, error) {
	url := fmt.Sprintf("https://api.cloudflare.com/client/v4/accounts/%s/stream/%s/token", s.accountID, videoUID)
	body := bytes.NewBufferString(fmt.Sprintf(`{"exp":%d}`, time.Now().Add(4*time.Hour).Unix()))

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+s.token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.http.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	if resp.StatusCode >= 400 {
		return "", fmt.Errorf("cloudflare stream token: %d %s", resp.StatusCode, string(data))
	}

	var result struct {
		Result struct {
			Token string `json:"token"`
		} `json:"result"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return "", err
	}
	return result.Result.Token, nil
}

// GetVideoInfo fetches metadata for a Cloudflare Stream video.
func (s *StreamClient) GetVideoInfo(ctx context.Context, videoUID string) (*StreamVideo, error) {
	url := fmt.Sprintf("https://api.cloudflare.com/client/v4/accounts/%s/stream/%s", s.accountID, videoUID)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+s.token)

	resp, err := s.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("cloudflare stream info: %d %s", resp.StatusCode, string(data))
	}

	var result struct {
		Result StreamVideo `json:"result"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}
	return &result.Result, nil
}
