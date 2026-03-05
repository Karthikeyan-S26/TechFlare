-- Insert Technical Round Questions (8 questions across 4 sections)
-- Run this in Supabase SQL Editor

INSERT INTO questions (round, type, content, options, correct_answer, marks)
VALUES
  -- SECTION 1: Rearrange Code - Question 1
  (
    'technical',
    'rearrange',
    'Arrange the following lines to form a valid Java program that prints the sum of even numbers from 1 to 5.',
    '{
      "section": 1,
      "section_name": "Rearrange Code",
      "code_lines": ["public class Numbers {", "public static void main(String[] args) {", "int sum = 0;", "for(int i = 1; i <= 5; i++) {", "if(i % 2 == 0) {", "sum = sum + i;", "}", "}", "System.out.println(sum);", "}", "}"],
      "shuffled_lines": ["public class Numbers {", "System.out.println(sum);", "int sum = 0;", "for(int i = 1; i <= 5; i++) {", "if(i % 2 == 0) {", "sum = sum + i;", "}", "}", "public static void main(String[] args) {", "}", "}"]
    }'::jsonb,
    'public class Numbers {|public static void main(String[] args) {|int sum = 0;|for(int i = 1; i <= 5; i++) {|if(i % 2 == 0) {|sum = sum + i;|}|}|System.out.println(sum);|}|}',
    2
  ),
  
  -- SECTION 1: Rearrange Code - Question 2
  (
    'technical',
    'rearrange',
    'Arrange the lines to correctly reverse a number.',
    '{
      "section": 1,
      "section_name": "Rearrange Code",
      "code_lines": ["public class ReverseNumber {", "public static void main(String[] args) {", "int num = 1234;", "int reverse = 0;", "while(num != 0) {", "int digit = num % 10;", "reverse = reverse * 10 + digit;", "num = num / 10;", "}", "System.out.println(\"Reverse = \" + reverse);", "}", "}"],
      "shuffled_lines": ["public class ReverseNumber {", "int reverse = 0;", "public static void main(String[] args) {", "while(num != 0) {", "int num = 1234;", "reverse = reverse * 10 + digit;", "int digit = num % 10;", "num = num / 10;", "}", "System.out.println(\"Reverse = \" + reverse);", "}", "}"]
    }'::jsonb,
    'public class ReverseNumber {|public static void main(String[] args) {|int num = 1234;|int reverse = 0;|while(num != 0) {|int digit = num % 10;|reverse = reverse * 10 + digit;|num = num / 10;|}|System.out.println("Reverse = " + reverse);|}|}',
    2
  ),
  
  -- SECTION 2: Pseudocode Logic - Question 3
  (
    'technical',
    'pseudocode',
    E'START\nA = 2\nB = 3\nC = 4\n\nRESULT = A + B * C - A + C\n\nPRINT RESULT\nEND\n\nWhat is the output?',
    '{
      "section": 2,
      "section_name": "Pseudocode Logic"
    }'::jsonb || '["12", "14", "16", "18"]'::jsonb,
    '16',
    2
  ),
  
  -- SECTION 2: Pseudocode Logic - Question 4
  (
    'technical',
    'pseudocode',
    E'START\n\nCOUNT = 0\n\nFOR I = 1 TO 2\n   FOR J = 1 TO 3\n      COUNT = COUNT + 1\n   END FOR\nEND FOR\n\nPRINT COUNT\nEND\n\nWhat is the output?',
    '{
      "section": 2,
      "section_name": "Pseudocode Logic"
    }'::jsonb || '["3", "4", "6", "9"]'::jsonb,
    '6',
    2
  ),
  
  -- SECTION 3: Find Syntax Errors - Question 5
  (
    'technical',
    'syntax_error',
    E'public class SyntaxGame\n{\n    public static void main(String args[])\n    {\n        int x = 10\n        int y = 5\n        int result = 0;\n\n        System.out.println("Program Started"\n\n        if(x > y)\n        {\n            System.out.println("X is greater")\n        else\n        {\n            System.out.println("Y is greater");\n        }\n\n        for(int i = 0; i < 5 i++)\n        {\n            System.out.println("Value " + i)\n        }\n\n        String text = "Debugging Game;\n        System.out.println(text)\n\n        result = x + y\n        System.out.println("Result = " + result)\n\n    }\n}\n\nHow many syntax errors are present?',
    '{
      "section": 3,
      "section_name": "Find Syntax Errors"
    }'::jsonb || '["6", "8", "10", "12"]'::jsonb,
    '10',
    2
  ),
  
  -- SECTION 3: Find Syntax Errors - Question 6
  (
    'technical',
    'syntax_error',
    E'public class ErrorFinder\n{\n    public static void main(String args[])\n    {\n        int num1 == 10;\n        int num2 = 20;\n\n        double total = num1 + num2\n\n        System.out.println("Calculation Start");\n\n        if num1 < num2\n        {\n            System.out.println("Num1 is smaller");\n        }\n\n        for(int i = 1; i <= 5; i--)\n        {\n            System.out.println("Loop value: " + i);\n        }\n\n        char grade = "A";\n\n        boolean flag = true\n        System.out.println("Flag value = " + flag);\n\n        String message = \'Debug Mode\';\n        System.out.println(message);\n    }\n}\n\nHow many syntax errors exist?',
    '{
      "section": 3,
      "section_name": "Find Syntax Errors"
    }'::jsonb || '["6", "7", "8", "9"]'::jsonb,
    '8',
    2
  ),
  
  -- SECTION 4: Output Prediction - Question 7
  (
    'technical',
    'output_prediction',
    E'public class OutputTest1 {\n    public static void main(String[] args) {\n        int x = 5;\n        int y = x + 3;\n        x = 10;\n\n        System.out.println(y);\n        System.out.println(y);\n    }\n}\n\nWhat is the output?',
    '{
      "section": 4,
      "section_name": "Predict Output"
    }'::jsonb || '["8 8", "5 10", "10 10", "8 10"]'::jsonb,
    '8 8',
    2
  ),
  
  -- SECTION 4: Output Prediction - Question 8
  (
    'technical',
    'output_prediction',
    E'public class OutputTest4 {\n    public static void main(String[] args) {\n        int x = 5;\n\n        System.out.println(x++);\n        System.out.println(++x);\n        System.out.println(--x);\n        System.out.println(x--);\n    }\n}\n\nWhat is the output?',
    '{
      "section": 4,
      "section_name": "Predict Output"
    }'::jsonb || '["5 7 6 6", "5 6 5 5", "5 7 7 6", "5 6 6 6"]'::jsonb,
    '5 7 6 6',
    2
  );

-- Verify total technical question count
SELECT 'Total technical questions:' as label, COUNT(*) as count
FROM questions
WHERE round = 'technical';