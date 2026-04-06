-- Update dkimSelector default from 'usesend' to 'bytesend'
-- Existing domains keep their current selector to avoid breaking active DKIM configurations
ALTER TABLE "Domain" ALTER COLUMN "dkimSelector" SET DEFAULT 'bytesend';
