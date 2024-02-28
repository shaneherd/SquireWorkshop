FROM mysql:8.2.0

# Create initial database from base dump
COPY ./initial_db.sql /docker-entrypoint-initdb.d/initial_db.sql

ENTRYPOINT ["docker-entrypoint.sh"]