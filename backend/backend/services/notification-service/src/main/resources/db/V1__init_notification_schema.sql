-- V1__init_notification_schema.sql
CREATE TYPE notification_channel AS ENUM ('SMS', 'EMAIL', 'IN_APP');

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    recipient_id UUID NOT NULL,
    channel notification_channel NOT NULL,
    destination VARCHAR(150) NOT NULL, -- Phone number or Email
    subject VARCHAR(255),
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
