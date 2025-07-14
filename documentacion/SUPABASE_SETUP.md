esquema implementado en supabase

```
-- Table: states
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: towns
CREATE TABLE towns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    state_id INTEGER NOT NULL REFERENCES states(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    postal_code VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_state_town UNIQUE (state_id, name)
);

-- Table: business_categories
CREATE TABLE business_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: businesses
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    town_id INTEGER NOT NULL REFERENCES towns(id),
    category_id INTEGER NOT NULL REFERENCES business_categories(id),

    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(150),
    website VARCHAR(300),
    facebook VARCHAR(200),
    instagram VARCHAR(200),
    google_maps_link TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    monday_hours VARCHAR(50),
    tuesday_hours VARCHAR(50),
    wednesday_hours VARCHAR(50),
    thursday_hours VARCHAR(50),
    friday_hours VARCHAR(50),
    saturday_hours VARCHAR(50),
    sunday_hours VARCHAR(50),

    keywords TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,

    -- Owner contact info (no acceso al sistema)
    owner_name VARCHAR(100),
    owner_phone VARCHAR(20),
    owner_email VARCHAR(150),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT unique_town_category_name UNIQUE (town_id, category_id, name)
);

-- Table: business_images
CREATE TABLE business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

```
