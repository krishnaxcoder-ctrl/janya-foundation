-- Delete existing campaigns first
DELETE FROM "public"."campaigns" WHERE "id" IN (
  'e7c090f4-3618-43db-b95e-f69b2f4e78dc',
  'dfe40255-d868-4eab-ab36-d492d95c7291',
  '552a18f9-654e-4602-a003-1c892482ca7d',
  'fc33fde4-70eb-40a5-8bbe-6833d6e03f5d'
);

-- Insert updated campaigns
INSERT INTO "public"."campaigns" ("id", "created_at", "title", "description", "image_url", "goal_amount", "raised_amount", "category", "organizer_name", "organizer_email", "organizer_phone", "status", "donors_count", "user_id") VALUES
('e7c090f4-3618-43db-b95e-f69b2f4e78dc', '2026-03-12 17:54:10.855414+00', 'Urgent: N8 Cochlear Processor Upgrade for 7-year-old Suyash', 'Suyash Bedekar needs an urgent upgrade to the N8 Cochlear Processor to continue his education. Production for his current device has stopped, making this upgrade critical for his hearing and future.', '/child.png', '1350000', '1200', 'Medical Help', 'Janya Foundation', 'contact@janyafoundation.org', null, 'approved', '1', null),
('dfe40255-d868-4eab-ab36-d492d95c7291', '2026-03-12 17:54:10.855414+00', 'Protect a Life: HPV Vaccinations for Underprivileged Women', 'Every donation helps fund critical HPV vaccinations for underprivileged women, protecting them from the risk of cervical cancer and ensuring a healthier future.', 'https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=1170&auto=format&fit=crop&q=80', '500000', '6600', 'Cervical Cancer Awareness', 'Janya Foundation', 'contact@janyafoundation.org', null, 'approved', '3', null),
('552a18f9-654e-4602-a003-1c892482ca7d', '2026-03-12 17:54:10.855414+00', 'Fight Against Leukemia: Support Darshana''s Life-Saving Treatment', 'Mrs. Darshana Padwal, 53, is fighting Acute Myeloid Leukemia (AML). She needs urgent medical intervention and supportive care to overcome this critical battle for her life.', '/800000/WhatsApp Image 2026-03-03 at 8.17.19 PM (1).jpeg', '530000', '600', 'Medical Relief', 'Janya Foundation', 'contact@janyafoundation.org', null, 'approved', '1', null),
('fc33fde4-70eb-40a5-8bbe-6833d6e03f5d', '2026-03-12 17:54:10.855414+00', 'Critical Care: Urgent Medical Support for an Elderly Mother', 'This elderly patient is currently in intensive care, requiring specialized medical procedures and round-the-clock monitoring to recover from a severe health crisis.', '/1200000/WhatsApp Image 2026-03-03 at 8.16.40 PM.jpeg', '800000', '300', 'Intensive Care', 'Janya Foundation', 'contact@janyafoundation.org', null, 'approved', '1', null);
