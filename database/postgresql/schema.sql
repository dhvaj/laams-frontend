-- LAAMS PostgreSQL schema
-- Structured data layer for users, roles, classes, assignments, exams, grades, attendance, progress, and communications.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'accessibility_profile') THEN
    CREATE TYPE accessibility_profile AS ENUM (
      'typical',
      'blind',
      'low-vision',
      'deaf',
      'dyslexic',
      'id',
      'adhd-autism'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
    CREATE TYPE assignment_status AS ENUM ('Incomplete', 'Submitted', 'Graded', 'Completed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_priority') THEN
    CREATE TYPE exam_priority AS ENUM ('Normal', 'High Priority');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_status') THEN
    CREATE TYPE attempt_status AS ENUM ('Not Started', 'In Progress', 'Submitted', 'Reviewed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
    CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Excused');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_channel') THEN
    CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp', 'in_app');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'file_asset_kind') THEN
    CREATE TYPE file_asset_kind AS ENUM ('assignment_upload', 'study_material', 'textbook', 'media', 'profile_document');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_material_kind') THEN
    CREATE TYPE study_material_kind AS ENUM ('textbook', 'revision_notes', 'worksheet', 'video', 'audio', 'external_link', 'study_content');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analytics_event_type') THEN
    CREATE TYPE analytics_event_type AS ENUM ('lesson_viewed', 'content_downloaded', 'assignment_submitted', 'exam_started', 'exam_submitted', 'accessibility_profile_changed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  grade_level text NOT NULL,
  accessibility_profile accessibility_profile NOT NULL DEFAULT 'typical',
  comorbidity_notes text,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'guardian',
  PRIMARY KEY (parent_id, student_id),
  CHECK (parent_id <> student_id)
);

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  grade_band text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level text NOT NULL,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  focus text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_students (
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  title text NOT NULL,
  lesson_slug text UNIQUE NOT NULL,
  grade_level text NOT NULL,
  mongodb_content_id text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accessibility_profile accessibility_profile NOT NULL,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  downloads_count integer NOT NULL DEFAULT 0,
  last_viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  instructions text,
  due_at timestamptz NOT NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status assignment_status NOT NULL DEFAULT 'Incomplete',
  notes text,
  upload_url text,
  auto_valuation_score numeric(5,2),
  grade text,
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  UNIQUE (assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority exam_priority NOT NULL DEFAULT 'Normal',
  scheduled_at timestamptz NOT NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  position integer NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('mcq', 'short', 'descriptive')),
  prompt text NOT NULL,
  options jsonb,
  correct_answer text,
  accessibility_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (exam_id, position)
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status attempt_status NOT NULL DEFAULT 'Not Started',
  started_at timestamptz,
  submitted_at timestamptz,
  score numeric(5,2),
  feedback text,
  UNIQUE (exam_id, student_id)
);

CREATE TABLE IF NOT EXISTS exam_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  answer text,
  is_correct boolean,
  score numeric(5,2),
  feedback text,
  UNIQUE (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  taken_by uuid REFERENCES users(id) ON DELETE SET NULL,
  attendance_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS attendance_items (
  attendance_record_id uuid NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status attendance_status NOT NULL,
  PRIMARY KEY (attendance_record_id, student_id)
);

CREATE TABLE IF NOT EXISTS progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  grade text NOT NULL,
  percentage integer NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  teacher_note text,
  assignments_completed integer NOT NULL DEFAULT 0,
  downloads_count integer NOT NULL DEFAULT 0,
  exam_performance numeric(5,2),
  reported_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE SET NULL,
  recipient_id uuid REFERENCES users(id) ON DELETE SET NULL,
  student_id uuid REFERENCES users(id) ON DELETE SET NULL,
  body text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  related_entity_type text,
  related_entity_id uuid,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_profile ON student_profiles(accessibility_profile);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_student ON progress_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER trg_student_profiles_updated_at
BEFORE UPDATE ON student_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role user_role NOT NULL,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  user_agent text,
  ip_address inet,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_accessibility_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accessibility_profile accessibility_profile NOT NULL,
  support_need text NOT NULL,
  support_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'profile',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, support_need)
);

CREATE TABLE IF NOT EXISTS file_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  kind file_asset_kind NOT NULL,
  storage_key text NOT NULL,
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
  alt_text text,
  transcript text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  material_kind study_material_kind NOT NULL DEFAULT 'study_content',
  body text,
  file_asset_id uuid REFERENCES file_assets(id) ON DELETE SET NULL,
  mongodb_content_id text,
  accessibility_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_adaptation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  source_content_id text NOT NULL,
  accessibility_profile accessibility_profile NOT NULL,
  output_layout text NOT NULL,
  operations jsonb NOT NULL DEFAULT '[]'::jsonb,
  cache_key text,
  generated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  event_type analytics_event_type NOT NULL,
  event_value numeric(10,2),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  destination text,
  quiet_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, channel)
);

CREATE TABLE IF NOT EXISTS discussion_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  title text NOT NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz
);

CREATE TABLE IF NOT EXISTS discussion_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  body text NOT NULL,
  moderation_status text NOT NULL DEFAULT 'visible' CHECK (moderation_status IN ('visible', 'hidden', 'flagged')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_accessibility_needs_student ON student_accessibility_needs(student_id);
CREATE INDEX IF NOT EXISTS idx_file_assets_owner ON file_assets(owner_id, kind);
CREATE INDEX IF NOT EXISTS idx_study_materials_class ON study_materials(class_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_adaptation_student ON content_adaptation_events(student_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_student ON analytics_events(student_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_posts_thread ON discussion_posts(thread_id, created_at);

DROP TRIGGER IF EXISTS trg_student_accessibility_needs_updated_at ON student_accessibility_needs;
CREATE TRIGGER trg_student_accessibility_needs_updated_at
BEFORE UPDATE ON student_accessibility_needs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_study_materials_updated_at ON study_materials;
CREATE TRIGGER trg_study_materials_updated_at
BEFORE UPDATE ON study_materials
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_discussion_posts_updated_at ON discussion_posts;
CREATE TRIGGER trg_discussion_posts_updated_at
BEFORE UPDATE ON discussion_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE VIEW v_student_dashboard_summary AS
SELECT
  u.id AS student_id,
  u.first_name || ' ' || u.last_name AS student_name,
  sp.grade_level,
  sp.accessibility_profile,
  COUNT(DISTINCT a.id) FILTER (WHERE s.status IN ('Incomplete', 'Submitted')) AS active_assignments,
  COUNT(DISTINCT ea.id) FILTER (WHERE ea.status IN ('Not Started', 'In Progress')) AS active_exams,
  COALESCE(AVG(pr.percentage), 0)::numeric(5,2) AS average_progress
FROM users u
LEFT JOIN student_profiles sp ON sp.user_id = u.id
LEFT JOIN assignment_submissions s ON s.student_id = u.id
LEFT JOIN assignments a ON a.id = s.assignment_id
LEFT JOIN exam_attempts ea ON ea.student_id = u.id
LEFT JOIN progress_reports pr ON pr.student_id = u.id
WHERE u.role = 'student'
GROUP BY u.id, u.first_name, u.last_name, sp.grade_level, sp.accessibility_profile;

CREATE OR REPLACE VIEW v_teacher_accessibility_breakdown AS
SELECT
  c.teacher_id,
  sp.accessibility_profile,
  COUNT(*) AS student_count
FROM classes c
JOIN class_students cs ON cs.class_id = c.id
JOIN student_profiles sp ON sp.user_id = cs.student_id
GROUP BY c.teacher_id, sp.accessibility_profile;

CREATE OR REPLACE VIEW v_parent_student_progress AS
SELECT
  psl.parent_id,
  psl.student_id,
  u.first_name || ' ' || u.last_name AS student_name,
  pr.grade,
  pr.percentage,
  pr.teacher_note,
  pr.assignments_completed,
  pr.downloads_count,
  pr.exam_performance,
  pr.reported_at
FROM parent_student_links psl
JOIN users u ON u.id = psl.student_id
LEFT JOIN progress_reports pr ON pr.student_id = psl.student_id;
