import { paths } from "../types/schema";
import { ErrorResponse } from "../types";
import { ByteSend } from "./bytesend";

type CreateDomainPayload =
  paths["/v1/domains"]["post"]["requestBody"]["content"]["application/json"];

type CreateDomainResponse = {
  data: CreateDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateDomainResponseSuccess =
  paths["/v1/domains"]["post"]["responses"]["200"]["content"]["application/json"];

type GetDomainsResponse = {
  data: GetDomainsResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainsResponseSuccess =
  paths["/v1/domains"]["get"]["responses"]["200"]["content"]["application/json"];

type VerifyDomainResponse = {
  data: VerifyDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type VerifyDomainResponseSuccess =
  paths["/v1/domains/{id}/verify"]["put"]["responses"]["200"]["content"]["application/json"];

type GetDomainResponse = {
  data: GetDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainResponseSuccess =
  paths["/v1/domains/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

type DeleteDomainResponse = {
  data: DeleteDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteDomainResponseSuccess =
  paths["/v1/domains/{id}"]["delete"]["responses"]["200"]["content"]["application/json"];

export class Domains {
  constructor(private readonly bytesend: ByteSend) {
    this.bytesend = bytesend;
  }

  async list(): Promise<GetDomainsResponse> {
    const data = await this.bytesend.get<GetDomainsResponseSuccess>("/domains");
    return data;
  }

  async create(payload: CreateDomainPayload): Promise<CreateDomainResponse> {
    const data = await this.bytesend.post<CreateDomainResponseSuccess>(
      "/domains",
      payload,
    );
    return data;
  }

  async verify(id: number): Promise<VerifyDomainResponse> {
    const data = await this.bytesend.put<VerifyDomainResponseSuccess>(
      `/domains/${id}/verify`,
      {},
    );
    return data;
  }

  async get(id: number): Promise<GetDomainResponse> {
    const data = await this.bytesend.get<GetDomainResponseSuccess>(
      `/domains/${id}`,
    );

    return data;
  }

  async delete(id: number): Promise<DeleteDomainResponse> {
    const data = await this.bytesend.delete<DeleteDomainResponseSuccess>(
      `/domains/${id}`,
    );

    return data;
  }
}
