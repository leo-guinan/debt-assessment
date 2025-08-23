/*
  # Create Quiz Response Tables

  1. New Tables
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `response_id` (text, unique identifier)
      - `submission_date` (timestamptz)
      - `primary_profile_type` (text)
      - `primary_profile_name` (text)
      - `match_percentage` (integer)
      - `readiness_score` (integer)
      - `readiness_level` (text)
      - `student_score` (integer)
      - `credit_score` (integer)
      - `medical_score` (integer)
      - `mortgage_score` (integer)
      - `multi_score` (integer)
      - `solidarity_score` (integer)
      - `freeform_response` (text, optional)
      - `contact_info` (text, optional)
      - `created_at` (timestamptz)

    - `individual_answers`
      - `id` (uuid, primary key)
      - `response_id` (text, foreign key)
      - `question_id` (integer)
      - `question_text` (text)
      - `answer_type` (text)
      - `selected_option` (text)
      - `ranked_options` (jsonb, optional)
      - `multi_select_options` (jsonb, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert access (for quiz submissions)
    - Add policies for authenticated read access (for admin review)
*/

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id text UNIQUE NOT NULL,
  submission_date timestamptz DEFAULT now(),
  primary_profile_type text NOT NULL,
  primary_profile_name text NOT NULL,
  match_percentage integer NOT NULL DEFAULT 0,
  readiness_score integer NOT NULL DEFAULT 0,
  readiness_level text NOT NULL,
  student_score integer NOT NULL DEFAULT 0,
  credit_score integer NOT NULL DEFAULT 0,
  medical_score integer NOT NULL DEFAULT 0,
  mortgage_score integer NOT NULL DEFAULT 0,
  multi_score integer NOT NULL DEFAULT 0,
  solidarity_score integer NOT NULL DEFAULT 0,
  freeform_response text,
  contact_info text,
  created_at timestamptz DEFAULT now()
);

-- Create individual_answers table
CREATE TABLE IF NOT EXISTS individual_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id text NOT NULL,
  question_id integer NOT NULL,
  question_text text NOT NULL,
  answer_type text NOT NULL DEFAULT 'multiple-choice',
  selected_option text NOT NULL,
  ranked_options jsonb,
  multi_select_options jsonb,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (response_id) REFERENCES quiz_responses(response_id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz_responses
CREATE POLICY "Allow public insert on quiz_responses"
  ON quiz_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on quiz_responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for individual_answers
CREATE POLICY "Allow public insert on individual_answers"
  ON individual_answers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on individual_answers"
  ON individual_answers
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_responses_response_id ON quiz_responses(response_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_submission_date ON quiz_responses(submission_date);
CREATE INDEX IF NOT EXISTS idx_individual_answers_response_id ON individual_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_individual_answers_question_id ON individual_answers(question_id);