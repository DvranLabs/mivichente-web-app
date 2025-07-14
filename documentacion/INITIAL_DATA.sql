-- Initial data to populate the mivichente database
-- Run this after creating the schema from SUPABASE_SETUP.md
-- Insert sample states
INSERT INTO
    states (name, code)
VALUES
    ('Nueva Esparta', 'NE'),
    ('Miranda', 'MI'),
    ('Distrito Capital', 'DC'),
    ('Carabobo', 'CA'),
    ('Zulia', 'ZU'),
    ('Aragua', 'AR');

-- Insert sample towns (with state_id references)
INSERT INTO
    towns (name, state_id, latitude, longitude, postal_code)
VALUES
    -- Nueva Esparta
    ('Porlamar', 1, 10.9577, -63.8497, '6301'),
    ('Pampatar', 1, 10.9833, -63.8000, '6302'),
    ('Juan Griego', 1, 11.0833, -63.9667, '6303'),
    ('Tubores', 1, 10.9667, -63.8833, '6304'),
    (
        'San Pedro de Coche',
        1,
        10.8000,
        -63.9833,
        '6305'
    ),
    -- Miranda
    ('Los Teques', 2, 10.3440, -67.0428, '1201'),
    ('Petare', 2, 10.5167, -66.8000, '1202'),
    ('Guarenas', 2, 10.4667, -66.6167, '1203'),
    ('Guatire', 2, 10.4667, -66.5500, '1204'),
    ('Charallave', 2, 10.2333, -66.8500, '1205'),
    -- Distrito Capital  
    ('Caracas', 3, 10.4806, -66.9036, '1010'),
    ('Catia', 3, 10.4833, -67.0333, '1011'),
    ('El Valle', 3, 10.4333, -66.9000, '1012'),
    -- Carabobo
    ('Valencia', 4, 10.1622, -68.0077, '2001'),
    ('Puerto Cabello', 4, 10.4731, -68.0125, '2002'),
    ('Guacara', 4, 10.2267, -67.8778, '2003'),
    -- Zulia
    ('Maracaibo', 5, 10.6427, -71.6125, '4001'),
    ('Cabimas', 5, 10.4000, -71.4500, '4002'),
    ('Ciudad Ojeda', 5, 10.1958, -71.3011, '4003'),
    -- Aragua
    ('Maracay', 6, 10.2353, -67.5911, '2101'),
    ('Turmero', 6, 10.2275, -67.4742, '2102'),
    ('La Victoria', 6, 10.2267, -67.3319, '2103');

-- Insert business categories
INSERT INTO
    business_categories (name, slug, description, icon, sort_order)
VALUES
    (
        'Restaurantes',
        'restaurantes',
        'Restaurantes y comida',
        '🍽️',
        1
    ),
    ('Pizza', 'pizza', 'Pizzerías', '🍕', 2),
    (
        'Hamburguesas',
        'hamburguesas',
        'Hamburgueserías',
        '🍔',
        3
    ),
    (
        'Sushi',
        'sushi',
        'Restaurantes de sushi',
        '🍣',
        4
    ),
    (
        'Comida China',
        'comida-china',
        'Restaurantes de comida china',
        '🥡',
        5
    ),
    (
        'Comida Italiana',
        'comida-italiana',
        'Restaurantes de comida italiana',
        '🍝',
        6
    ),
    (
        'Comida Mexicana',
        'comida-mexicana',
        'Restaurantes de comida mexicana',
        '🌮',
        7
    ),
    ('Arepas', 'arepas', 'Areperas', '🫓', 8),
    (
        'Postres',
        'postres',
        'Heladerías y pastelerías',
        '🍰',
        9
    ),
    ('Panadería', 'panaderia', 'Panaderías', '🍞', 10),
    (
        'Bebidas',
        'bebidas',
        'Juguerías y cafeterías',
        '🥤',
        11
    ),
    (
        'Comida Rápida',
        'comida-rapida',
        'Comida rápida en general',
        '🚀',
        12
    ),
    (
        'Mariscos',
        'mariscos',
        'Restaurantes de mariscos',
        '🦐',
        13
    ),
    (
        'Parrilla',
        'parrilla',
        'Parrillas y asados',
        '🥩',
        14
    ),
    (
        'Vegetariano',
        'vegetariano',
        'Comida vegetariana y vegana',
        '🥗',
        15
    );

-- Insert some sample businesses
INSERT INTO
    businesses (
        name,
        slug,
        description,
        address,
        town_id,
        category_id,
        phone,
        whatsapp,
        email,
        website,
        monday_hours,
        tuesday_hours,
        wednesday_hours,
        thursday_hours,
        friday_hours,
        saturday_hours,
        sunday_hours,
        keywords,
        active,
        featured,
        owner_name,
        owner_phone,
        owner_email
    )
VALUES
    (
        'Pizza La Margherita',
        'pizza-la-margherita-porlamar',
        'Las mejores pizzas artesanales de Porlamar con ingredientes frescos',
        'Av. Santiago Mariño, Centro Comercial Sambil, Local 23',
        1,
        -- Porlamar
        2,
        -- Pizza
        '0295-1234567',
        '04161234567',
        'info@pizzalamargherita.com',
        'https://pizzalamargherita.com',
        '11:00-22:00',
        '11:00-22:00',
        '11:00-22:00',
        '11:00-22:00',
        '11:00-23:00',
        '11:00-23:00',
        '12:00-22:00',
        ARRAY ['pizza', 'italiana', 'delivery', 'artesanal'],
        true,
        true,
        'Mario Rossi',
        '04161234567',
        'mario@pizzalamargherita.com'
    ),
    (
        'Burger House Margarita',
        'burger-house-margarita',
        'Hamburguesas gourmet con ingredientes de primera calidad',
        'Calle Cedeno, entre Marcano y Hernandez',
        1,
        -- Porlamar
        3,
        -- Hamburguesas
        '0295-2345678',
        '04162345678',
        'contacto@burgerhouse.com.ve',
        null,
        '12:00-22:00',
        '12:00-22:00',
        '12:00-22:00',
        '12:00-22:00',
        '12:00-23:00',
        '12:00-23:00',
        '12:00-22:00',
        ARRAY ['hamburguesas', 'gourmet', 'delivery', 'papas'],
        true,
        false,
        'Carlos González',
        '04162345678',
        'carlos@burgerhouse.com.ve'
    ),
    (
        'Sakura Sushi Bar',
        'sakura-sushi-bar-valencia',
        'Auténtico sushi japonés preparado por chef especializado',
        'Av. Bolívar Norte, C.C. Carabobo Plaza, Nivel Gourmet',
        14,
        -- Valencia
        4,
        -- Sushi
        '0241-3456789',
        '04243456789',
        'reservas@sakurasushi.ve',
        'https://sakurasushi.ve',
        'Cerrado',
        '18:00-23:00',
        '18:00-23:00',
        '18:00-23:00',
        '18:00-24:00',
        '18:00-24:00',
        '18:00-23:00',
        ARRAY ['sushi', 'japonés', 'reservas', 'sake'],
        true,
        true,
        'Kenji Tanaka',
        '04243456789',
        'kenji@sakurasushi.ve'
    ),
    (
        'Arepa de Mi Tierra',
        'arepa-de-mi-tierra-caracas',
        'Arepas tradicionales venezolanas con gran variedad de rellenos',
        'Av. Francisco de Miranda, Altamira, Local 45',
        11,
        -- Caracas
        8,
        -- Arepas
        '0212-4567890',
        '04124567890',
        'pedidos@arepademitierra.com',
        null,
        '06:00-20:00',
        '06:00-20:00',
        '06:00-20:00',
        '06:00-20:00',
        '06:00-20:00',
        '06:00-20:00',
        '07:00-19:00',
        ARRAY ['arepas', 'venezolana', 'desayuno', 'tradicional'],
        true,
        false,
        'María Rodríguez',
        '04124567890',
        'maria@arepademitierra.com'
    );

-- Insert some sample business images
INSERT INTO
    business_images (
        business_id,
        image_url,
        alt_text,
        is_main,
        sort_order
    )
VALUES
    (
        1,
        'https://example.com/pizza-margherita-main.jpg',
        'Pizza Margherita del restaurante',
        true,
        0
    ),
    (
        1,
        'https://example.com/pizza-margherita-interior.jpg',
        'Interior del restaurante Pizza La Margherita',
        false,
        1
    ),
    (
        2,
        'https://example.com/burger-house-main.jpg',
        'Hamburguesa gourmet de Burger House',
        true,
        0
    ),
    (
        3,
        'https://example.com/sakura-sushi-main.jpg',
        'Plato de sushi del Sakura Sushi Bar',
        true,
        0
    ),
    (
        4,
        'https://example.com/arepa-tierra-main.jpg',
        'Arepa rellena de Arepa de Mi Tierra',
        true,
        0
    );