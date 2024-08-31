create table [metadata].[document_type]
(
	[id]                    int                 not null,
    [state]                 smallint            not null,   
    [flags]                 int                 not null,
    [ucode]                 uniqueidentifier    null,
    [code]                  varchar(128)        not null,
    [name]                  nvarchar(256)       not null,
    [comments]              nvarchar(max)       null,
    [created_by]            int                 not null,
    [created_date]          datetime2           not null,
    [modified_by]           int                 not null,
    [modified_date]         datetime2           not null, 
    constraint [pk_document_type] primary key ([id]),
)
