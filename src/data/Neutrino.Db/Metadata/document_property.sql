create table [metadata].[property]
(
	[id]                    int                 not null,
    [document_type_id]      int                 not null,
    [parent_id]             int                 null,
    [state]                 smallint            not null,   
    [flags]                 int                 not null,
    [ordinal]               int                 null,
    [ucode]                 uniqueidentifier    null,
    [code]                  varchar(128)        not null,
    [name]                  nvarchar(256)       not null,
    [comments]              nvarchar(max)       null,
    [created_by]            int                 not null,
    [created_date]          datetime2           not null,
    [modified_by]           int                 not null,
    [modified_date]         datetime2           not null, 
    constraint [pk_property] primary key ([id]), 
    constraint [fk_property_document_type] foreign key ([document_type_id]) 
        references [metadata].[document_type]([id]) on delete cascade,
)
