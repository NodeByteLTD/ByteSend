package bytesend

import "context"

type Campaign struct {
	ID                 string   `json:"id"`
	Name               string   `json:"name"`
	From               string   `json:"from"`
	Subject            string   `json:"subject"`
	PreviewText        string   `json:"previewText"`
	ContactBookID      string   `json:"contactBookId"`
	HTML               string   `json:"html"`
	Content            string   `json:"content"`
	Status             string   `json:"status"`
	ScheduledAt        string   `json:"scheduledAt"`
	BatchSize          int      `json:"batchSize"`
	BatchWindowMinutes int      `json:"batchWindowMinutes"`
	Total              int      `json:"total"`
	Sent               int      `json:"sent"`
	Delivered          int      `json:"delivered"`
	Opened             int      `json:"opened"`
	Clicked            int      `json:"clicked"`
	Unsubscribed       int      `json:"unsubscribed"`
	Bounced            int      `json:"bounced"`
	HardBounced        int      `json:"hardBounced"`
	Complained         int      `json:"complained"`
	ReplyTo            []string `json:"replyTo"`
	CC                 []string `json:"cc"`
	BCC                []string `json:"bcc"`
	CreatedAt          string   `json:"createdAt"`
	UpdatedAt          string   `json:"updatedAt"`
}

type CampaignSummary struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	From         string `json:"from"`
	Subject      string `json:"subject"`
	Status       string `json:"status"`
	ScheduledAt  string `json:"scheduledAt"`
	Total        int    `json:"total"`
	Sent         int    `json:"sent"`
	Delivered    int    `json:"delivered"`
	Unsubscribed int    `json:"unsubscribed"`
	CreatedAt    string `json:"createdAt"`
	UpdatedAt    string `json:"updatedAt"`
}

type CreateCampaignPayload struct {
	Name          string      `json:"name"`
	From          string      `json:"from"`
	Subject       string      `json:"subject"`
	ContactBookID string      `json:"contactBookId"`
	PreviewText   string      `json:"previewText,omitempty"`
	Content       string      `json:"content,omitempty"`
	HTML          string      `json:"html,omitempty"`
	ReplyTo       StringSlice `json:"replyTo,omitempty"`
	CC            StringSlice `json:"cc,omitempty"`
	BCC           StringSlice `json:"bcc,omitempty"`
	SendNow       bool        `json:"sendNow,omitempty"`
	ScheduledAt   string      `json:"scheduledAt,omitempty"`
	BatchSize     int         `json:"batchSize,omitempty"`
}

type ListCampaignsParams struct {
	Page   string
	Status string
	Search string
}

type ListCampaignsResponse struct {
	Campaigns []CampaignSummary `json:"campaigns"`
	TotalPage int               `json:"totalPage"`
}

type ScheduleCampaignPayload struct {
	ScheduledAt string `json:"scheduledAt,omitempty"`
	BatchSize   int    `json:"batchSize,omitempty"`
}

type CampaignActionResponse struct {
	Success bool `json:"success"`
}

type CampaignsService struct {
	client *Client
}

func (s *CampaignsService) Create(ctx context.Context, payload CreateCampaignPayload) (Campaign, error) {
	var resp Campaign
	err := s.client.post(ctx, "/campaigns", payload, &resp)
	return resp, err
}

func (s *CampaignsService) List(ctx context.Context, params ListCampaignsParams) (ListCampaignsResponse, error) {
	path := s.client.buildPath("/campaigns", map[string]string{
		"page":   params.Page,
		"status": params.Status,
		"search": params.Search,
	})
	var resp ListCampaignsResponse
	err := s.client.get(ctx, path, &resp)
	return resp, err
}

func (s *CampaignsService) Get(ctx context.Context, campaignID string) (Campaign, error) {
	var resp Campaign
	err := s.client.get(ctx, "/campaigns/"+campaignID, &resp)
	return resp, err
}

func (s *CampaignsService) Delete(ctx context.Context, campaignID string) (Campaign, error) {
	var resp Campaign
	err := s.client.delete(ctx, "/campaigns/"+campaignID, nil, &resp)
	return resp, err
}

func (s *CampaignsService) Schedule(ctx context.Context, campaignID string, payload ScheduleCampaignPayload) (CampaignActionResponse, error) {
	var resp CampaignActionResponse
	err := s.client.post(ctx, "/campaigns/"+campaignID+"/schedule", payload, &resp)
	return resp, err
}

func (s *CampaignsService) Pause(ctx context.Context, campaignID string) (CampaignActionResponse, error) {
	var resp CampaignActionResponse
	err := s.client.post(ctx, "/campaigns/"+campaignID+"/pause", nil, &resp)
	return resp, err
}

func (s *CampaignsService) Resume(ctx context.Context, campaignID string) (CampaignActionResponse, error) {
	var resp CampaignActionResponse
	err := s.client.post(ctx, "/campaigns/"+campaignID+"/resume", nil, &resp)
	return resp, err
}
