-- Phase 3+4+5: Wellbeing check-ins table

CREATE TABLE wellbeing_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood TEXT NOT NULL CHECK (mood IN ('low', 'okay', 'good')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);
