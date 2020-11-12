import { OidcMetadata } from "oidc-client";
import { useCallback } from "react";

export type CreateMetaDataResult = Partial<OidcMetadata>;
export const useCreateMetaData = () => {
    return useCallback<
        (
            metadataUrl: string,
            overwritingMetaData?: Partial<OidcMetadata>
        ) => Promise<CreateMetaDataResult>
    >(
        async (
            metadataUrl: string,
            overwritingMetaData?: Partial<OidcMetadata>
        ) => {
            return overwritingMetaData && metadataUrl
                ? {
                      ...(await (await fetch(metadataUrl)).json()),
                      ...overwritingMetaData,
                  }
                : metadataUrl
                ? await (await fetch(metadataUrl)).json()
                : overwritingMetaData;
        },
        []
    );
};
