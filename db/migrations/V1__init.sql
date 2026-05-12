CREATE TABLE space_target (
    id                   BIGSERIAL PRIMARY KEY,
    name                 VARCHAR(255)     NOT NULL,
    type                 VARCHAR(100)     NOT NULL,
    distance_light_years DOUBLE PRECISION NOT NULL
);

INSERT INTO space_target (name, type, distance_light_years) VALUES
    ('Vega',            'Main sequence',  25.04),
    ('Pleiades cluster','Open cluster',   444),
    ('Galactic center', 'Galactic bulge', 26000);
