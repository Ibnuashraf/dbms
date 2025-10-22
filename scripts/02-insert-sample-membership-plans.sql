-- Insert sample membership plans
INSERT INTO membership_plans (plan_name, description, price, duration_days, features, is_active) VALUES
('Basic Plan', 'Basic membership with gym access', 29.99, 30, ARRAY['Gym Access', 'Basic Equipment'], true),
('Premium Plan', 'Premium membership with personal training', 79.99, 30, ARRAY['Gym Access', 'Personal Training', 'Nutrition Consultation'], true),
('VIP Plan', 'VIP membership with all services', 149.99, 30, ARRAY['Gym Access', 'Personal Training', 'Nutrition Consultation', 'Spa Access', 'Priority Booking'], true),
('Monthly Basic', 'Monthly basic plan', 49.99, 30, ARRAY['Gym Access', 'Group Classes'], true),
('Annual Premium', 'Annual premium plan with discount', 799.99, 365, ARRAY['Gym Access', 'Personal Training', 'Nutrition Consultation', 'Spa Access', 'Priority Booking', 'Annual Discount'], true);
