create table [core].[document]
(
	[id]                    int                 not null,
    [document_type_id]      int                 not null,
    [state]                 smallint            not null,   
    [code]                  varchar(128)        not null,
    [name]                  nvarchar(256)       not null,
    [comments]              nvarchar(max)       null,
    [created_by]            int                 not null,
    [created_date]          datetime2           not null,
    [modified_by]           int                 not null,
    [modified_date]         datetime2           not null, 
)
