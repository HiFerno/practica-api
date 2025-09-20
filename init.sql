--TABLA USUARIOS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--TABLA PARA MENSAJES
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- Si se borra un usuario, se borran sus mensajes 
);

--RELACIONES DE SEGUIMIENTO ENTRE USUARIOS
CREATE TABLE followers (
    -- El usuario que está siguiendo a otro
    follower_id INTEGER NOT NULL,
    -- El usuario que está siendo seguido
    following_id INTEGER NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT fk_follower
        FOREIGN KEY(follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_following
        FOREIGN KEY(following_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- OPTIMIZACION DE BUSQUEDAS (consultas)
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);