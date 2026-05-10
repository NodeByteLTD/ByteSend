package bytesend

import "context"

type ContactBookCount struct {
	Contacts int `json:"contacts"`
}

type ContactBook struct {
	ID                 string            `json:"id"`
	Name               string            `json:"name"`
	TeamID             int               `json:"teamId"`
	Properties         map[string]string `json:"properties"`
	Variables          []string          `json:"variables"`
	Emoji              string            `json:"emoji"`
	DoubleOptInEnabled bool              `json:"doubleOptInEnabled,omitempty"`
	DoubleOptInFrom    string            `json:"doubleOptInFrom,omitempty"`
	DoubleOptInSubject string            `json:"doubleOptInSubject,omitempty"`
	DoubleOptInContent string            `json:"doubleOptInContent,omitempty"`
	CreatedAt          string            `json:"createdAt"`
	UpdatedAt          string            `json:"updatedAt"`
	Count              *ContactBookCount `json:"_count,omitempty"`
}

type CreateContactBookPayload struct {
	Name               string            `json:"name"`
	Emoji              string            `json:"emoji,omitempty"`
	Properties         map[string]string `json:"properties,omitempty"`
	Variables          []string          `json:"variables,omitempty"`
	DoubleOptInEnabled *bool             `json:"doubleOptInEnabled,omitempty"`
	DoubleOptInFrom    string            `json:"doubleOptInFrom,omitempty"`
	DoubleOptInSubject string            `json:"doubleOptInSubject,omitempty"`
	DoubleOptInContent string            `json:"doubleOptInContent,omitempty"`
}

type UpdateContactBookPayload struct {
	Name               string            `json:"name,omitempty"`
	Emoji              string            `json:"emoji,omitempty"`
	Properties         map[string]string `json:"properties,omitempty"`
	Variables          []string          `json:"variables,omitempty"`
	DoubleOptInEnabled *bool             `json:"doubleOptInEnabled,omitempty"`
	DoubleOptInFrom    string            `json:"doubleOptInFrom,omitempty"`
	DoubleOptInSubject string            `json:"doubleOptInSubject,omitempty"`
	DoubleOptInContent string            `json:"doubleOptInContent,omitempty"`
}

type DeleteContactBookResponse struct {
	ID      string `json:"id"`
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ContactBooksService struct {
	client *Client
}

func (s *ContactBooksService) List(ctx context.Context) ([]ContactBook, error) {
	var resp []ContactBook
	err := s.client.get(ctx, "/contactBooks", &resp)
	return resp, err
}

func (s *ContactBooksService) Create(ctx context.Context, payload CreateContactBookPayload) (ContactBook, error) {
	var resp ContactBook
	err := s.client.post(ctx, "/contactBooks", payload, &resp)
	return resp, err
}

func (s *ContactBooksService) Get(ctx context.Context, contactBookID string) (ContactBook, error) {
	var resp ContactBook
	err := s.client.get(ctx, "/contactBooks/"+contactBookID, &resp)
	return resp, err
}

func (s *ContactBooksService) Update(ctx context.Context, contactBookID string, payload UpdateContactBookPayload) (ContactBook, error) {
	var resp ContactBook
	err := s.client.patch(ctx, "/contactBooks/"+contactBookID, payload, &resp)
	return resp, err
}

func (s *ContactBooksService) Delete(ctx context.Context, contactBookID string) (DeleteContactBookResponse, error) {
	var resp DeleteContactBookResponse
	err := s.client.delete(ctx, "/contactBooks/"+contactBookID, nil, &resp)
	return resp, err
}
