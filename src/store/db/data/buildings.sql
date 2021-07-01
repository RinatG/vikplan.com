-- первичный импорт всего, что уже было в vikplan.com
with buildings as (
select [slug], [name], [multiple], [effect1_name], [effect2_name], [effect3_name] from
  openrowset(bulk N'C:\Sources\vikplan.com\src\store\db\buildings_list.json', single_nclob) AS json
  cross apply openjson(BulkColumn)
  with (slug varchar(25), [name] nvarchar(250), multiple varchar(5), [effect1_name] nvarchar(250), [effect2_name] nvarchar(250), [effect3_name] nvarchar(250)) AS buildings
)
, levels as (
select buildings_level.* from
 openrowset(bulk N'C:\Sources\vikplan.com\src\store\db\buildings.json', single_nclob) as json
 cross apply openjson(BulkColumn)
 with (id int, slug varchar(25), [name] nvarchar(250), level int, food bigint, lumber bigint, iron bigint, stone bigint, silver bigint, gold int, bronze int, bronze2 int, bronze3 int, time_days int, time_seconds int, effect1_value varchar(10), effect2_value varchar(10), effect3_value varchar(10), req1 nvarchar(250), req2 nvarchar(250), req3 nvarchar(250), req4 nvarchar(250), inf int) AS buildings_level
)
--insert into buildings_level
select levels.id, levels.slug, isnull(levels.[name], buildings.[name]) as [name], levels.[level], buildings.multiple, levels.food, levels.lumber, levels.iron, levels.stone, levels.silver, levels.bronze, levels.bronze2, levels.bronze3, levels.gold, levels.time_days, levels.time_seconds, buildings.effect1_name, levels.effect1_value, buildings.effect2_name, levels.effect2_value, buildings.effect3_name, levels.effect3_value, levels.req1, levels.req2, levels.req3, levels.req4, levels.inf
from levels
left join buildings on buildings.slug = levels.slug
order by [id]

-- хранилище зданий
drop table [buildings_level]
go
create table buildings_level (
	id int, slug varchar(25), [name] nvarchar(250), level int, multiple varchar(5), food bigint, lumber bigint, iron bigint, stone bigint, silver bigint, bronze int, bronze2 int, bronze3 int, gold int, time_days int, time_seconds int, effect1_name nvarchar(250), effect1_value varchar(10), effect2_name nvarchar(250), effect2_value varchar(10), effect3_name nvarchar(250), effect3_value varchar(10), req1 nvarchar(250), req2 nvarchar(250), req3 nvarchar(250), req4 nvarchar(250), inf bigint
)
go
truncate table buildings_level
go


-- буферная таблица для импорта зданий из файлов csv
drop table [buildings36]
go
create table [dbo].[buildings36]([slug] [varchar](50),[name] [nvarchar](250),[level] bigint,food bigint,lumber bigint,iron bigint,stone bigint,silver bigint,bronze int,bronze2 int,bronze3 int,[gold] int,[time_days] int,[time_seconds] int,[inf] bigint,effect1_name nvarchar(250),effect1_value varchar(10),[req1] nvarchar(250),[req2] nvarchar(250),[req3] nvarchar(250),[req4] nvarchar(250))
go
truncate table [buildings36]
go
bulk insert [buildings36]
from 'C:\Sources\vikplan.com\src\store\db\data\buildings36.csv'
with (firstrow=2,fieldterminator=';',tablock,codepage='65001')
go


-- добавляем новые здания из буфера в хранилище зданий
delete from [buildings_level] where [level] > 35
go
declare @last int
select @last=max(id) from [buildings_level]
insert into [buildings_level] (id, slug, [name], [level], food, lumber, iron, stone, silver, bronze, bronze2, bronze3, gold, time_days, time_seconds, effect1_name, effect1_value, effect2_name, effect2_value, effect3_name, effect3_value, req1, req2, req3, req4, inf)
select @last+ROW_NUMBER() over (order by slug, [level]) as id, slug, [name], [level], food, lumber, iron, stone, silver, cast(isnull(bronze, 0) as int) as bronze, cast(isnull(bronze2, 0) as int) as bronze2, cast(isnull(bronze3, 0) as int) as bronze3, gold, time_days, time_seconds, '' effect1_name, '' effect1_value, '' effect2_name, '' effect2_value, '' effect3_name, '' effect3_value, req1, req2, req3, req4, inf
from [buildings36]
go


-- добавляем только новые здания в buildings.js
select [id],[slug],[name],[level],[food],[lumber],[iron],[stone],[silver],[bronze],[bronze2],[bronze3],[gold],[time_days],[time_seconds],[effect1_value],[effect2_value],[effect3_value],[req1],[req2],[req3],[req4],[inf]
from [buildings_level] where [level] > 35
order by [level], slug
for json auto

-- добавляем только новые здания в buildings_list.js
select slug, [name], (select top 1 effect1_name from [buildings_level] where slug = l.slug order by [level]) effect1_name, (select top 1 effect2_name from [buildings_level] where slug = l.slug order by [level]) effect2_name, (select top 1 effect3_name from [buildings_level] where slug = l.slug order by [level]) effect3_name, string_agg(cast(replace(effect1_value,'%','') as bigint), ';') within group (order by [level]) as effects1, string_agg(cast(replace(effect2_value,'%','') as bigint), ';') within group (order by [level]) as effects2, string_agg(cast(replace(effect3_value,'%','') as bigint), ';') within group (order by [level]) as effects3
from [buildings_level] as l
--where [level] > 35
group by slug, [name]
order by slug
for json auto
