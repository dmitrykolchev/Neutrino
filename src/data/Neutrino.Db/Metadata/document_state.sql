create table [metadata].[document_state]
(
	[id]                    int                 not null,
    [document_type_id]      int                 not null,
    [state]                 smallint            not null,   
    [flags]                 int                 not null,
    [ucode]                 uniqueidentifier    null,
    [value]                 smallint            not null,
    [code]                  varchar(128)        not null,
    [name]                  nvarchar(256)       not null,
    [comments]              nvarchar(max)       null,
    [created_by]            int                 not null,
    [created_date]          datetime2           not null,
    [modified_by]           int                 not null,
    [modified_date]         datetime2           not null, 
    constraint [pk_document_state] primary key ([id]), 
    constraint [fk_document_state_document_type] foreign key ([document_type_id]) 
        references [metadata].[document_type]([id]) on delete cascade,
)
