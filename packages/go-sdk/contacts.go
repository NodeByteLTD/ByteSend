package bytesend

import "context"

type Contact struct {
	ID            string            `json:"id"`
	FirstName     string            `json:"firstName,omitempty"`
	LastName      string            `json:"lastName,omitempty"`
	Email         string            `json:"email"`
	Subscribed    bool              `json:"subscribed"`
	Properties    map[string]string `json:"properties"`
	ContactBookID string            `json:"contactBookId"`
	CreatedAt     string            `json:"createdAt"`
	UpdatedAt     string            `json:"updatedAt"`
}

type CreateContactPayload struct {
	Email      string            `json:"email"`
	FirstName  string            `json:"firstName,omitempty"`
	LastName   string            `json:"lastName,omitempty"`
	Properties map[string]string `json:"properties,omitempty"`
	Subscribed *bool             `json:"subscribed,omitempty"`
}

type UpdateContactPayload struct {
	FirstName  string            `json:"firstName,omitempty"`
	LastName   string            `json:"lastName,omitempty"`
	Properties map[string]string `json:"properties,omitempty"`
	Subscribed *bool             `json:"subscribed,omitempty"`
}

type CreateContactResponse struct {
	ContactID string `json:"contactId"`
}

type DeleteContactResponse struct {
	Success bool `json:"success"`
}

type ListContactsParams struct {
	Emails string
	Page   string
	Limit  string
	IDs    string
}

type BulkCreateContactsResponse struct {
	Message string `json:"message"`
	Count   int    `json:"count"`
}

type BulkDeleteContactsPayload struct {
	ContactIDs []string `json:"contactIds"`
}

type BulkDeleteContactsResponse struct {
	Success bool `json:"success"`
	Count   int  `json:"count"`
}

type ContactsService struct {
	client *Client
}

func (c *ContactsService) Create(ctx context.Context, contactBookID string, payload CreateContactPayload) (CreateContactResponse, error) {
	var resp CreateContactResponse
	err := c.client.post(ctx, "/contactBooks/"+contactBookID+"/contacts", payload, &resp)
	return resp, err
}

func (c *ContactsService) Get(ctx context.Context, contactBookID, contactID string) (Contact, error) {
	var resp Contact
	err := c.client.get(ctx, "/contactBooks/"+contactBookID+"/contacts/"+contactID, &resp)
	return resp, err
}

func (c *ContactsService) Update(ctx context.Context, contactBookID, contactID string, payload UpdateContactPayload) (CreateContactResponse, error) {
	var resp CreateContactResponse
	err := c.client.patch(ctx, "/contactBooks/"+contactBookID+"/contacts/"+contactID, payload, &resp)
	return resp, err
}

func (c *ContactsService) Upsert(ctx context.Context, contactBookID, contactID string, payload CreateContactPayload) (CreateContactResponse, error) {
	var resp CreateContactResponse
	err := c.client.put(ctx, "/contactBooks/"+contactBookID+"/contacts/"+contactID, payload, &resp)
	return resp, err
}

func (c *ContactsService) List(ctx context.Context, contactBookID string, params ListContactsParams) ([]Contact, error) {
	path := c.client.buildPath("/contactBooks/"+contactBookID+"/contacts", map[string]string{
		"emails": params.Emails,
		"page":   params.Page,
		"limit":  params.Limit,
		"ids":    params.IDs,
	})
	var resp []Contact
	err := c.client.get(ctx, path, &resp)
	return resp, err
}

func (c *ContactsService) BulkCreate(ctx context.Context, contactBookID string, payload []CreateContactPayload) (BulkCreateContactsResponse, error) {
	var resp BulkCreateContactsResponse
	err := c.client.post(ctx, "/contactBooks/"+contactBookID+"/contacts/bulk", payload, &resp)
	return resp, err
}

func (c *ContactsService) BulkDelete(ctx context.Context, contactBookID string, payload BulkDeleteContactsPayload) (BulkDeleteContactsResponse, error) {
	var resp BulkDeleteContactsResponse
	err := c.client.delete(ctx, "/contactBooks/"+contactBookID+"/contacts/bulk", payload, &resp)
	return resp, err
}

func (c *ContactsService) Delete(ctx context.Context, contactBookID, contactID string) (DeleteContactResponse, error) {
	var resp DeleteContactResponse
	err := c.client.delete(ctx, "/contactBooks/"+contactBookID+"/contacts/"+contactID, nil, &resp)
	return resp, err
}
