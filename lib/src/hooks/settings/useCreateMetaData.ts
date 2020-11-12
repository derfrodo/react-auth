import { OidcMetadata } from "oidc-client";
import { useCallback } from "react";

export const useCreateMetaData = (
    metadataUrl: string,
    overwritingMetaData?: Partial<OidcMetadata>
) => {
    return useCallback(async () => {
        return overwritingMetaData && metadataUrl
            ? {
                  ...(await (await fetch(metadataUrl)).json()),
                  ...overwritingMetaData,
              }
            : metadataUrl
            ? await (await fetch(metadataUrl)).json()
            : overwritingMetaData;
    }, [metadataUrl, overwritingMetaData]);
};
