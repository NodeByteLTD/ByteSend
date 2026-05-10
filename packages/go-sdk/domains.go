package bytesend

import "context"

type DNSRecord struct {
	Type        string `json:"type"`
	Name        string `json:"name"`
	Value       string `json:"value"`
	TTL         string `json:"ttl"`
	Priority    string `json:"priority,omitempty"`
	Status      string `json:"status"`
	Recommended bool   `json:"recommended,omitempty"`
}

type Domain struct {
	ID                int         `json:"id"`
	Name              string      `json:"name"`
	TeamID            int         `json:"teamId"`
	Status            string      `json:"status"`
	Region            string      `json:"region"`
	ClickTracking     bool        `json:"clickTracking"`
	OpenTracking      bool        `json:"openTracking"`
	PublicKey         string      `json:"publicKey"`
	DKIMStatus        string      `json:"dkimStatus,omitempty"`
	SPFDetails        string      `json:"spfDetails,omitempty"`
	CreatedAt         string      `json:"createdAt"`
	UpdatedAt         string      `json:"updatedAt"`
	DMARCAdded        bool        `json:"dmarcAdded"`
	IsVerifying       bool        `json:"isVerifying"`
	ErrorMessage      string      `json:"errorMessage,omitempty"`
	Subdomain         string      `json:"subdomain,omitempty"`
	VerificationError string      `json:"verificationError,omitempty"`
	LastCheckedTime   string      `json:"lastCheckedTime,omitempty"`
	DNSRecords        []DNSRecord `json:"dnsRecords"`
}

type CreateDomainPayload struct {
	Name   string `json:"name"`
	Region string `json:"region"`
}

type DeleteDomainResponse struct {
	ID      int    `json:"id"`
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type VerifyDomainResponse struct {
	Message string `json:"message"`
}

type DomainsService struct {
	client *Client
}

func (s *DomainsService) List(ctx context.Context) ([]Domain, error) {
	var resp []Domain
	err := s.client.get(ctx, "/domains", &resp)
	return resp, err
}

func (s *DomainsService) Create(ctx context.Context, payload CreateDomainPayload) (Domain, error) {
	var resp Domain
	err := s.client.post(ctx, "/domains", payload, &resp)
	return resp, err
}

func (s *DomainsService) Get(ctx context.Context, id string) (Domain, error) {
	var resp Domain
	err := s.client.get(ctx, "/domains/"+id, &resp)
	return resp, err
}

func (s *DomainsService) Verify(ctx context.Context, id string) (VerifyDomainResponse, error) {
	var resp VerifyDomainResponse
	err := s.client.put(ctx, "/domains/"+id+"/verify", nil, &resp)
	return resp, err
}

func (s *DomainsService) Delete(ctx context.Context, id string) (DeleteDomainResponse, error) {
	var resp DeleteDomainResponse
	err := s.client.delete(ctx, "/domains/"+id, nil, &resp)
	return resp, err
}
