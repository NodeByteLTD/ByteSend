package bytesend

import "context"

type EmailTimeSeriesParams struct {
	Days     string
	DomainID string
}

type EmailTimeSeriesEntry struct {
	Date       string `json:"date"`
	Sent       int    `json:"sent"`
	Delivered  int    `json:"delivered"`
	Opened     int    `json:"opened"`
	Clicked    int    `json:"clicked"`
	Bounced    int    `json:"bounced"`
	Complained int    `json:"complained"`
}

type EmailTotals struct {
	Sent       int `json:"sent"`
	Delivered  int `json:"delivered"`
	Opened     int `json:"opened"`
	Clicked    int `json:"clicked"`
	Bounced    int `json:"bounced"`
	Complained int `json:"complained"`
}

type EmailTimeSeriesResponse struct {
	Result      []EmailTimeSeriesEntry `json:"result"`
	TotalCounts EmailTotals            `json:"totalCounts"`
}

type ReputationMetricsParams struct {
	DomainID string
}

type ReputationMetricsResponse struct {
	Delivered     int     `json:"delivered"`
	HardBounced   int     `json:"hardBounced"`
	Complained    int     `json:"complained"`
	BounceRate    float64 `json:"bounceRate"`
	ComplaintRate float64 `json:"complaintRate"`
}

type AnalyticsService struct {
	client *Client
}

func (s *AnalyticsService) EmailTimeSeries(ctx context.Context, params EmailTimeSeriesParams) (EmailTimeSeriesResponse, error) {
	path := s.client.buildPath("/analytics/email-time-series", map[string]string{
		"days":     params.Days,
		"domainId": params.DomainID,
	})
	var resp EmailTimeSeriesResponse
	err := s.client.get(ctx, path, &resp)
	return resp, err
}

func (s *AnalyticsService) ReputationMetrics(ctx context.Context, params ReputationMetricsParams) (ReputationMetricsResponse, error) {
	path := s.client.buildPath("/analytics/reputation-metrics", map[string]string{
		"domainId": params.DomainID,
	})
	var resp ReputationMetricsResponse
	err := s.client.get(ctx, path, &resp)
	return resp, err
}
