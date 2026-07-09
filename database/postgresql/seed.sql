-- LAAMS PostgreSQL seed data
-- Password hashes are demo placeholders. Replace with bcrypt hashes from the backend auth service.

WITH inserted_users AS (
  INSERT INTO users (id, username, email, password_hash, first_name, last_name, role)
  VALUES
    ('00000000-0000-0000-0000-000000000001', 'aarav', 'student@school.edu', 'demo-hash', 'Aarav', 'Patel', 'student'),
    ('00000000-0000-0000-0000-000000000002', 'arjun', 'teacher@school.edu', 'demo-hash', 'Arjun', 'Sharma', 'teacher'),
    ('00000000-0000-0000-0000-000000000003', 'admin', 'admin@laams.edu', 'demo-hash', 'System', 'Admin', 'admin'),
    ('00000000-0000-0000-0000-000000000004', 'rahul', 'parent@home.com', 'demo-hash', 'Rahul', 'Patel', 'parent'),
    ('00000000-0000-0000-0000-000000000005', 'maya', 'maya@school.edu', 'demo-hash', 'Maya', 'Singh', 'student'),
    ('00000000-0000-0000-0000-000000000006', 'rohan', 'rohan@school.edu', 'demo-hash', 'Rohan', 'Das', 'student'),
    ('00000000-0000-0000-0000-000000000007', 'priya', 'priya@school.edu', 'demo-hash', 'Priya', 'Sharma', 'student')
  ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role
  RETURNING id
)
INSERT INTO student_profiles (user_id, grade_level, accessibility_profile, preferred_language)
VALUES
  ('00000000-0000-0000-0000-000000000001', '8', 'dyslexic', 'en'),
  ('00000000-0000-0000-0000-000000000005', '8', 'typical', 'en'),
  ('00000000-0000-0000-0000-000000000006', '8', 'adhd-autism', 'en'),
  ('00000000-0000-0000-0000-000000000007', '8', 'low-vision', 'en')
ON CONFLICT (user_id) DO UPDATE SET
  grade_level = EXCLUDED.grade_level,
  accessibility_profile = EXCLUDED.accessibility_profile,
  preferred_language = EXCLUDED.preferred_language;

INSERT INTO parent_student_links (parent_id, student_id, relationship)
VALUES ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'father')
ON CONFLICT DO NOTHING;

INSERT INTO subjects (id, name, grade_band, description)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Science', '6-10', 'Middle-school science curriculum'),
  ('10000000-0000-0000-0000-000000000002', 'Mathematics', '6-10', 'Middle-school mathematics curriculum'),
  ('10000000-0000-0000-0000-000000000003', 'History', '6-10', 'Middle-school history curriculum')
ON CONFLICT (name) DO UPDATE SET
  grade_band = EXCLUDED.grade_band,
  description = EXCLUDED.description;

INSERT INTO classes (id, name, grade_level, subject_id, teacher_id, focus)
VALUES
  ('20000000-0000-0000-0000-000000000001', '8th Grade Science', '8', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'The Solar System, Basic Chemistry'),
  ('20000000-0000-0000-0000-000000000002', '8th Grade Math', '8', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Pre-Algebra, Fractions')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  focus = EXCLUDED.focus,
  teacher_id = EXCLUDED.teacher_id;

INSERT INTO class_students (class_id, student_id)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006')
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, subject_id, title, lesson_slug, grade_level, mongodb_content_id, created_by)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'The Solar System', 'solar-system', '8', 'lesson_solar_system_v1', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (lesson_slug) DO UPDATE SET
  title = EXCLUDED.title,
  mongodb_content_id = EXCLUDED.mongodb_content_id;

INSERT INTO assignments (id, class_id, lesson_id, title, subject, instructions, due_at, created_by)
VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'The Water Cycle Quiz', 'Science', 'Submit short notes or an uploaded answer file.', now() + interval '1 day', '00000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', NULL, 'Fractions Worksheet', 'Math', 'Complete all adaptive worksheet questions.', now() + interval '4 days', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  instructions = EXCLUDED.instructions,
  due_at = EXCLUDED.due_at;

INSERT INTO assignment_submissions (assignment_id, student_id, status, feedback)
VALUES
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Incomplete', NULL),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Incomplete', NULL)
ON CONFLICT (assignment_id, student_id) DO UPDATE SET
  status = EXCLUDED.status,
  feedback = EXCLUDED.feedback;

INSERT INTO exams (id, class_id, title, description, priority, scheduled_at, created_by)
VALUES
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Science: Solar System', 'Adaptive assessment with MCQs, short answers, and simplified prompts.', 'Normal', now() + interval '7 days', '00000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Midterm: History', 'Covers chapters 1-4 with accessible question formats.', 'High Priority', now() + interval '10 days', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  scheduled_at = EXCLUDED.scheduled_at;

INSERT INTO exam_questions (exam_id, position, question_type, prompt, options, correct_answer, accessibility_notes)
VALUES
  ('50000000-0000-0000-0000-000000000001', 1, 'mcq', 'What is the largest planet in our solar system?', '["Earth", "Mars", "Jupiter", "Saturn"]'::jsonb, 'Jupiter', '{"id":"Use larger answer buttons","dyslexic":"Increase spacing"}'::jsonb),
  ('50000000-0000-0000-0000-000000000001', 2, 'mcq', 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Uranus"]'::jsonb, 'Mars', '{"deaf":"Use visual clue for red planet"}'::jsonb),
  ('50000000-0000-0000-0000-000000000001', 3, 'short', 'Briefly describe what a star is.', NULL, 'A luminous sphere of plasma held together by gravity.', '{}'::jsonb)
ON CONFLICT (exam_id, position) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer;

INSERT INTO progress_reports (student_id, subject_id, grade, percentage, teacher_note, assignments_completed, downloads_count, exam_performance)
VALUES
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A', 92, 'Strong performance with adaptive visual modules.', 4, 3, 91.00),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'B', 85, 'Fractions improved with high-contrast color coding.', 3, 2, 84.00);

INSERT INTO messages (sender_id, recipient_id, student_id, body)
VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Aarav has a History essay due next week. Let me know if he needs an extension.'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Thank you. He is using the audio adaptation and it is going well.');

INSERT INTO permissions (id, code, description)
VALUES
  ('60000000-0000-0000-0000-000000000001', 'users.manage', 'Create, update, deactivate, and assign roles to users'),
  ('60000000-0000-0000-0000-000000000002', 'classes.manage', 'Create classes, assign teachers, and enroll students'),
  ('60000000-0000-0000-0000-000000000003', 'content.upload', 'Upload study content, textbook sections, media, and resources'),
  ('60000000-0000-0000-0000-000000000004', 'assignments.manage', 'Create, update, grade, and review assignments'),
  ('60000000-0000-0000-0000-000000000005', 'exams.manage', 'Schedule exams, manage questions, and review attempts'),
  ('60000000-0000-0000-0000-000000000006', 'progress.view_child', 'View linked child progress and reports'),
  ('60000000-0000-0000-0000-000000000007', 'reports.view', 'View academic, accessibility, and system reports'),
  ('60000000-0000-0000-0000-000000000008', 'lessons.learn', 'Access lessons, assignments, exams, and adaptive content')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

INSERT INTO role_permissions (role, permission_id)
VALUES
  ('admin', '60000000-0000-0000-0000-000000000001'),
  ('admin', '60000000-0000-0000-0000-000000000002'),
  ('admin', '60000000-0000-0000-0000-000000000003'),
  ('admin', '60000000-0000-0000-0000-000000000004'),
  ('admin', '60000000-0000-0000-0000-000000000005'),
  ('admin', '60000000-0000-0000-0000-000000000007'),
  ('teacher', '60000000-0000-0000-0000-000000000003'),
  ('teacher', '60000000-0000-0000-0000-000000000004'),
  ('teacher', '60000000-0000-0000-0000-000000000005'),
  ('teacher', '60000000-0000-0000-0000-000000000007'),
  ('parent', '60000000-0000-0000-0000-000000000006'),
  ('student', '60000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

INSERT INTO student_accessibility_needs (student_id, accessibility_profile, support_need, support_value, source)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'dyslexic', 'read-aloud', '{"enabled":true}'::jsonb, 'registration'),
  ('00000000-0000-0000-0000-000000000001', 'dyslexic', 'large-spacing', '{"lineHeight":"relaxed","chunking":"short"}'::jsonb, 'registration'),
  ('00000000-0000-0000-0000-000000000006', 'adhd-autism', 'low-distraction', '{"animations":false,"steps":"short"}'::jsonb, 'registration'),
  ('00000000-0000-0000-0000-000000000007', 'low-vision', 'large-text', '{"fontScale":"large","contrast":"high"}'::jsonb, 'registration')
ON CONFLICT (student_id, support_need) DO UPDATE SET
  accessibility_profile = EXCLUDED.accessibility_profile,
  support_value = EXCLUDED.support_value,
  source = EXCLUDED.source,
  is_active = true;

INSERT INTO study_materials (id, class_id, lesson_id, uploaded_by, title, subject, material_kind, body, mongodb_content_id, accessibility_notes)
VALUES
  ('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Solar System Revision Notes', 'Science', 'study_content', 'Short revision notes with adapted reading support for different accessibility profiles.', 'lesson_solar_system_v1', '{"profiles":["typical","blind","low-vision","deaf","dyslexic","id","adhd-autism"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  accessibility_notes = EXCLUDED.accessibility_notes;

INSERT INTO notification_preferences (user_id, channel, enabled, destination)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'in_app', true, NULL),
  ('00000000-0000-0000-0000-000000000004', 'whatsapp', true, '+910000000000'),
  ('00000000-0000-0000-0000-000000000002', 'email', true, 'teacher@school.edu')
ON CONFLICT (user_id, channel) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  destination = EXCLUDED.destination;

INSERT INTO content_adaptation_events (student_id, lesson_id, source_content_id, accessibility_profile, output_layout, operations, cache_key)
VALUES
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'lesson_solar_system_v1', 'dyslexic', 'bulleted-high-spacing', '["simplified-text","increased-spacing","chunked-content"]'::jsonb, 'lesson_solar_system_v1:dyslexic:en'),
  ('00000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 'lesson_solar_system_v1', 'low-vision', 'free-flow-high-contrast', '["large-text","high-contrast","magnification-safe"]'::jsonb, 'lesson_solar_system_v1:low-vision:en');

INSERT INTO analytics_events (student_id, class_id, lesson_id, event_type, event_value, metadata)
VALUES
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'lesson_viewed', 600, '{"unit":"seconds"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'content_downloaded', 1, '{"resource":"revision-notes"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', NULL, 'assignment_submitted', 1, '{"assignmentId":"40000000-0000-0000-0000-000000000001"}'::jsonb);

INSERT INTO notifications (user_id, channel, title, body, related_entity_type, related_entity_id, sent_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'in_app', 'Assignment due tomorrow', 'The Water Cycle Quiz is due tomorrow at 11:59 PM.', 'assignment', '40000000-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000004', 'whatsapp', 'Progress update', 'Aarav completed 4 Science assignments this month.', 'progress_report', NULL, now());

INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
VALUES
  ('00000000-0000-0000-0000-000000000003', 'seed.database', 'database', NULL, '{"source":"LAAMS SRD V1"}'::jsonb);
