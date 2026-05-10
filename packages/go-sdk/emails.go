package bytesend

import "context"

type Attachment struct {
	Filename string `json:"filename"`
	Content  []byte `json:"content"`
}

type SendEmailPayload struct {
	To          []string          `json:"to"`
	From        string            `json:"from"`
	Subject     string            `json:"subject,omitempty"`
	TemplateID  string            `json:"templateId,omitempty"`
	Variables   map[string]string `json:"variables,omitempty"`
	ReplyTo     []string          `json:"replyTo,omitempty"`
	CC          []string          `json:"cc,omitempty"`
	BCC         []string          `json:"bcc,omitempty"`
	Text        string            `json:"text,omitempty"`
	HTML        string            `json:"html,omitempty"`
	Headers     map[string]string `json:"headers,omitempty"`
	Attachments []Attachment      `json:"attachments,omitempty"`
	ScheduledAt string            `json:"scheduledAt,omitempty"`
	InReplyToID string            `json:"inReplyToId,omitempty"`
}

type CreateEmailResponse struct {
	EmailID string `json:"emailId"`
}

type Email struct {
	ID          string       `json:"id"`
	TeamID      int          `json:"teamId"`
	To          StringSlice  `json:"to"`
	ReplyTo     StringSlice  `json:"replyTo,omitempty"`
	CC          StringSlice  `json:"cc,omitempty"`
	BCC         StringSlice  `json:"bcc,omitempty"`
	From        string       `json:"from"`
	Subject     string       `json:"subject"`
	HTML        string       `json:"html"`
	Text        string       `json:"text"`
	CreatedAt   string       `json:"createdAt"`
	UpdatedAt   string       `json:"updatedAt"`
	EmailEvents []EmailEvent `json:"emailEvents"`
}

type EmailEvent struct {
	EmailID   string `json:"emailId"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
	Data      any    `json:"data,omitempty"`
}

type UpdateEmailPayload struct {
	ScheduledAt string `json:"scheduledAt"`
}

type BatchEmailResponse struct {
	Data []CreateEmailResponse `json:"data"`
}

type EmailSummary struct {
	ID           string      `json:"id"`
	To           StringSlice `json:"to"`
	ReplyTo      StringSlice `json:"replyTo,omitempty"`
	CC           StringSlice `json:"cc,omitempty"`
	BCC          StringSlice `json:"bcc,omitempty"`
	From         string      `json:"from"`
	Subject      string      `json:"subject"`
	HTML         string      `json:"html"`
	Text         string      `json:"text"`
	CreatedAt    string      `json:"createdAt"`
	UpdatedAt    string      `json:"updatedAt"`
	LatestStatus string      `json:"latestStatus"`
	ScheduledAt  string      `json:"scheduledAt"`
	DomainID     *int        `json:"domainId"`
}

type ListEmailsParams struct {
	Page      string
	Limit     string
	StartDate string
	EndDate   string
	DomainID  string
}

type ListEmailsResponse struct {
	Data  []EmailSummary `json:"data"`
	Count int            `json:"count"`
}

type EmailsService struct {
	client *Client
}

func (e *EmailsService) Create(ctx context.Context, payload SendEmailPayload, idempotencyKey ...string) (CreateEmailResponse, error) {
	var resp CreateEmailResponse
	var err error
	if len(idempotencyKey) > 0 && idempotencyKey[0] != "" {
		err = e.client.postWithHeaders(ctx, "/emails", payload, &resp, map[string]string{
			"Idempotency-Key": idempotencyKey[0],
		})
	} else {
		err = e.client.post(ctx, "/emails", payload, &resp)
	}
	return resp, err
}

func (e *EmailsService) Batch(ctx context.Context, payload []SendEmailPayload, idempotencyKey ...string) (BatchEmailResponse, error) {
	var resp BatchEmailResponse
	var err error
	if len(idempotencyKey) > 0 && idempotencyKey[0] != "" {
		err = e.client.postWithHeaders(ctx, "/emails/batch", payload, &resp, map[string]string{
			"Idempotency-Key": idempotencyKey[0],
		})
	} else {
		err = e.client.post(ctx, "/emails/batch", payload, &resp)
	}
	return resp, err
}

func (e *EmailsService) List(ctx context.Context, params ListEmailsParams) (ListEmailsResponse, error) {
	path := e.client.buildPath("/emails", map[string]string{
		"page":      params.Page,
		"limit":     params.Limit,
		"startDate": params.StartDate,
		"endDate":   params.EndDate,
		"domainId":  params.DomainID,
	})
	var resp ListEmailsResponse
	err := e.client.get(ctx, path, &resp)
	return resp, err
}

func (e *EmailsService) Get(ctx context.Context, id string) (Email, error) {
	var resp Email
	err := e.client.get(ctx, "/emails/"+id, &resp)
	return resp, err
}

func (e *EmailsService) Update(ctx context.Context, id string, payload UpdateEmailPayload) (CreateEmailResponse, error) {
	var resp CreateEmailResponse
	err := e.client.patch(ctx, "/emails/"+id, payload, &resp)
	return resp, err
}

func (e *EmailsService) Cancel(ctx context.Context, id string) (CreateEmailResponse, error) {
	var resp CreateEmailResponse
	err := e.client.post(ctx, "/emails/"+id+"/cancel", nil, &resp)
	return resp, err
}
