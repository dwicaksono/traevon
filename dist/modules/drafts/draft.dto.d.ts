import { z } from "@hono/zod-openapi";
export declare const CreateDraftDto: z.ZodObject<{
    content: z.ZodString;
    prompt: z.ZodOptional<z.ZodString>;
    source_references: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        source_id: z.ZodString;
        source_type: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        retrieved_at: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    created_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const FinalizeDraftDto: z.ZodObject<{
    authorized_by: z.ZodString;
}, z.core.$strip>;
export declare const ListDraftsQueryDto: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT_PENDING: "DRAFT_PENDING";
        DRAFT_APPROVED: "DRAFT_APPROVED";
        DRAFT_REJECTED: "DRAFT_REJECTED";
        WRITTEN_TO_SOURCE: "WRITTEN_TO_SOURCE";
    }>>;
}, z.core.$strip>;
export declare const DraftIdParam: z.ZodObject<{
    draft_id: z.ZodString;
}, z.core.$strip>;
export declare const DraftResponseDto: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    status: z.ZodEnum<{
        DRAFT_PENDING: "DRAFT_PENDING";
        DRAFT_APPROVED: "DRAFT_APPROVED";
        DRAFT_REJECTED: "DRAFT_REJECTED";
        WRITTEN_TO_SOURCE: "WRITTEN_TO_SOURCE";
    }>;
    authorized_by: z.ZodNullable<z.ZodString>;
    authorized_at: z.ZodNullable<z.ZodString>;
    source_references: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    target_record_id: z.ZodNullable<z.ZodString>;
    prompt: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    created_by: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const DraftListResponseDto: z.ZodObject<{
    drafts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        status: z.ZodEnum<{
            DRAFT_PENDING: "DRAFT_PENDING";
            DRAFT_APPROVED: "DRAFT_APPROVED";
            DRAFT_REJECTED: "DRAFT_REJECTED";
            WRITTEN_TO_SOURCE: "WRITTEN_TO_SOURCE";
        }>;
        authorized_by: z.ZodNullable<z.ZodString>;
        authorized_at: z.ZodNullable<z.ZodString>;
        source_references: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        target_record_id: z.ZodNullable<z.ZodString>;
        prompt: z.ZodNullable<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        created_by: z.ZodNullable<z.ZodString>;
        metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export declare const ErrorResponseDto: z.ZodObject<{
    error: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
