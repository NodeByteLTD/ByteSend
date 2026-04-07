"""Domain resource client using TypedDict shapes (no Pydantic)."""
from __future__ import annotations

from typing import Optional, Tuple, List

from .types import (
    APIError,
    Domain,
    DomainCreate,
    DomainCreateResponse,
    DomainDeleteResponse,
    DomainVerifyResponse,
)


class Domains:
    """Client for `/domains` endpoints."""

    def __init__(self, bytesend: "ByteSend") -> None:
        self.bytesend = bytesend

    def list(self) -> Tuple[Optional[List[Domain]], Optional[APIError]]:
        data, err = self.bytesend.get("/domains")
        return (data, err)  # type: ignore[return-value]

    def create(self, payload: DomainCreate) -> Tuple[Optional[DomainCreateResponse], Optional[APIError]]:
        data, err = self.bytesend.post("/domains", payload)
        return (data, err)  # type: ignore[return-value]

    def verify(self, domain_id: int) -> Tuple[Optional[DomainVerifyResponse], Optional[APIError]]:
        data, err = self.bytesend.put(f"/domains/{domain_id}/verify", {})
        return (data, err)  # type: ignore[return-value]

    def get(self, domain_id: int) -> Tuple[Optional[Domain], Optional[APIError]]:
        data, err = self.bytesend.get(f"/domains/{domain_id}")
        return (data, err)  # type: ignore[return-value]

    def delete(self, domain_id: int) -> Tuple[Optional[DomainDeleteResponse], Optional[APIError]]:
        data, err = self.bytesend.delete(f"/domains/{domain_id}")
        return (data, err)  # type: ignore[return-value]

from .bytesend import ByteSend  # noqa: E402  pylint: disable=wrong-import-position
