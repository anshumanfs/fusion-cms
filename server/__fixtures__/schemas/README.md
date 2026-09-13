# Beta Sample Schemas

These fixtures are release-ready examples for the dashboard schema builder and generated API tests.

Each file contains:

- `app`: the application metadata to create in the dashboard.
- `schemas`: one or more `createAppSchema(input: ...)` payloads.
- `accessSchemas`: optional access-control records that can be created with `createAccessSchema`.

The `schema` field mirrors the current generator format. Values such as `enums` and `defaultValue` are code fragments consumed by the existing template compiler, so string defaults intentionally include quotes.

