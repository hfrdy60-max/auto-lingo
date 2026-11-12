-- SELECT-only QA diagnostics; PostgreSQL 15+.
-- 365 days is a placeholder test window, NOT approved freshness policy.

-- F-09: orphan or mismatched polymorphic entity_sources links.
select e.id,e.entity_table,e.entity_id,e.source_id
from entity_sources e
left join terms t on e.entity_table='terms' and t.id=e.entity_id
left join parts p on e.entity_table='parts' and p.id=e.entity_id
left join systems s on e.entity_table='systems' and s.id=e.entity_id
left join diagnostics d on e.entity_table='diagnostics' and d.id=e.entity_id
left join repair_scenarios r on e.entity_table='repair_scenarios' and r.id=e.entity_id
left join lessons l on e.entity_table='lessons' and l.id=e.entity_id
left join vehicle_models vm on e.entity_table='vehicle_models' and vm.id=e.entity_id
left join brands b on e.entity_table='brands' and b.id=e.entity_id
where case e.entity_table
 when 'terms' then t.id is null when 'parts' then p.id is null
 when 'systems' then s.id is null when 'diagnostics' then d.id is null
 when 'repair_scenarios' then r.id is null when 'lessons' then l.id is null
 when 'vehicle_models' then vm.id is null when 'brands' then b.id is null
 else true end;

-- F-01/F-10: verified rows missing source links, all eight allowed entities.
select 'terms' entity_table,t.id from terms t where t.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='terms' and e.entity_id=t.id)
union all select 'parts',p.id from parts p where p.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='parts' and e.entity_id=p.id)
union all select 'systems',s.id from systems s where s.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='systems' and e.entity_id=s.id)
union all select 'diagnostics',d.id from diagnostics d where d.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='diagnostics' and e.entity_id=d.id)
union all select 'repair_scenarios',r.id from repair_scenarios r where r.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='repair_scenarios' and e.entity_id=r.id)
union all select 'lessons',l.id from lessons l where l.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='lessons' and e.entity_id=l.id)
union all select 'vehicle_models',v.id from vehicle_models v where v.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='vehicle_models' and e.entity_id=v.id)
union all select 'brands',b.id from brands b where b.verification_status='verified' and not exists(select 1 from entity_sources e where e.entity_table='brands' and e.entity_id=b.id);

-- F-10: source status, freshness and locator diagnostics.
select e.entity_table,e.entity_id,e.source_id,s.verification_status,s.last_checked_at,e.citation_note
from entity_sources e join sources s on s.id=e.source_id
where s.verification_status<>'verified' or s.last_checked_at is null
or s.last_checked_at<current_date-interval '365 days'
or nullif(trim(e.citation_note),'') is null;

-- Direct-source vehicle specifications: source status/freshness.
select v.id,v.vehicle_model_id,v.spec_key,v.source_id,s.verification_status,s.last_checked_at
from vehicle_specifications v left join sources s on s.id=v.source_id
where v.verification_status='verified' and
(s.id is null or s.verification_status<>'verified' or s.last_checked_at is null or s.last_checked_at<current_date-interval '365 days');

-- Direct-source part fitment: locator is not represented in current schema;
-- this query can check source status/freshness only.
select p.id,p.part_id,p.vehicle_model_id,p.source_id,s.verification_status,s.last_checked_at
from part_vehicle_compatibility p left join sources s on s.id=p.source_id
where p.verification_status='verified' and
(s.id is null or s.verification_status<>'verified' or s.last_checked_at is null or s.last_checked_at<current_date-interval '365 days');
