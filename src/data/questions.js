// QUESTION POOLS FOR RENAISSANCE 2026 (1st Year & 2nd Year Tracks)
// Extracted directly from official Symposium Word Documents:
// - 1st Year: 10 Pattern Problems + 10 Basic Programming Problems
// - 2nd Year: 25 Pattern Problems (Covering Easy, Medium, Hard, and Extra patterns)

// ==========================================
// 1ST YEAR TRACK (Freshers / Novice Track)
// 10 Patterns (Q1 - Q10) + 10 Basic Programming (Q11 - Q20)
// ==========================================
export const QUESTIONS_1ST_YEAR = [
  // --- 10 PATTERN PROBLEMS ---
  {
    id: 101,
    number: "Q1",
    name: "Plus Sign (+) Star Pattern",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a Plus Sign (+) cross pattern of stars for the given input n.",
    input: "n = 5",
    output: `  *
  *
*****
  *
  *`,
    constraints: "n is an odd integer >= 3",
    example: "Center row and center column contain stars."
  },
  {
    id: 102,
    number: "Q2",
    name: "Repeated Number Triangle",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a right-angled repeated number triangle for the given input n.",
    input: "n = 4",
    output: `1
2 2
3 3 3
4 4 4 4`,
    constraints: "1 <= n <= 9",
    example: "Row i prints the number i, i times."
  },
  {
    id: 103,
    number: "Q3",
    name: "Inverted Star Triangle",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print an inverted right-angled triangle of stars for the given input n.",
    input: "n = 5",
    output: `*****
****
***
**
*`,
    constraints: "1 <= n <= 20",
    example: "Row i prints (n - i + 1) stars."
  },
  {
    id: 104,
    number: "Q4",
    name: "Alternating 1s and 0s Grid",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print alternating horizontal rows of 1s and 0s for the given input n.",
    input: "n = 5",
    output: `1 1 1 1 1
0 0 0 0 0
1 1 1 1 1
0 0 0 0 0
1 1 1 1 1`,
    constraints: "1 <= n <= 20",
    example: "Odd rows contain 1s and even rows contain 0s."
  },
  {
    id: 105,
    number: "Q5",
    name: "Hollow Inverted Triangle",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a hollow inverted right-angled triangle of stars for the given input n.",
    input: "n = 5",
    output: `* * * * *
*     *
*   *
* *
*`,
    constraints: "1 <= n <= 20",
    example: "Only the boundary edges of the inverted triangle are printed."
  },
  {
    id: 106,
    number: "Q6",
    name: "Centered Star Pyramid",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a centered pyramid of stars with spaces for the given input n.",
    input: "n = 4",
    output: `   *
  * *
 * * *
* * * *`,
    constraints: "1 <= n <= 20",
    example: "Centered pyramid with leading space padding."
  },
  {
    id: 107,
    number: "Q7",
    name: "Binary Alternate Triangle",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print an alternating 1 and 0 binary right-angled triangle starting each row with 1.",
    input: "n = 4",
    output: `1
1 0
1 0 1
1 0 1 0`,
    constraints: "1 <= n <= 20",
    example: "Each row starts with 1 and alternates 1, 0, 1, 0..."
  },
  {
    id: 108,
    number: "Q8",
    name: "Solid Square Matrix",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a solid n x n square block of stars for the given input n.",
    input: "n = 5",
    output: `*****
*****
*****
*****
*****`,
    constraints: "1 <= n <= 20",
    example: "Square matrix with n rows and n columns."
  },
  {
    id: 109,
    number: "Q9",
    name: "Hollow Square Box",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a hollow n x n square boundary of stars for the given input n.",
    input: "n = 5",
    output: `*****
*   *
*   *
*   *
*****`,
    constraints: "n >= 2",
    example: "Stars on borders only; interior filled with spaces."
  },
  {
    id: 110,
    number: "Q10",
    name: "Right-Aligned Descending Numbers",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print right-aligned descending repeated numbers from n down to 1.",
    input: "n = 5",
    output: `5 5 5 5 5
  4 4 4 4
    3 3 3
      2 2
        1`,
    constraints: "1 <= n <= 9",
    example: "Row i starts with (i - 1)*2 spaces, printing (n - i + 1) repeated numbers."
  },

  // --- 10 BASIC PROGRAMMING PROBLEMS ---
  {
    id: 111,
    number: "Q11",
    name: "Reverse a Given String",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to read a given string and print it in reverse order.",
    input: 'string = "hello"',
    output: '"olleh"',
    constraints: "String length <= 100",
    example: 'Input "hello" becomes "olleh".'
  },
  {
    id: 112,
    number: "Q12",
    name: "Multiplication Table",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to print the multiplication table of a given number up to 10.",
    input: "n = 5",
    output: `5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50`,
    constraints: "1 <= n <= 100",
    example: "Print table from multiplier 1 to 10."
  },
  {
    id: 113,
    number: "Q13",
    name: "Even or Odd Check",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to check if a given integer is Even or Odd.",
    input: "n = 7",
    output: "Odd",
    constraints: "-10^9 <= n <= 10^9",
    example: "7 % 2 != 0, so output is Odd."
  },
  {
    id: 114,
    number: "Q14",
    name: "Positive, Negative or Zero",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to check whether a given number is Positive, Negative, or Zero.",
    input: "n = -12",
    output: "Negative",
    constraints: "-10^9 <= n <= 10^9",
    example: "Number is less than 0, so output is Negative."
  },
  {
    id: 115,
    number: "Q15",
    name: "Largest of Two Numbers",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to find the largest of two given numbers.",
    input: "a = 25, b = 40",
    output: "40",
    constraints: "-10^9 <= a, b <= 10^9",
    example: "40 is greater than 25."
  },
  {
    id: 116,
    number: "Q16",
    name: "First 10 Natural Numbers",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to print the first ten natural numbers.",
    input: "n = 10",
    output: "1 2 3 4 5 6 7 8 9 10",
    constraints: "Natural numbers start from 1",
    example: "Iterate from 1 to 10 and print each number separated by spaces."
  },
  {
    id: 117,
    number: "Q17",
    name: "Length of a String",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to find and print the length of a given string.",
    input: 'string = "Renaissance"',
    output: "11",
    constraints: "Standard ASCII string",
    example: '"Renaissance" has 11 characters.'
  },
  {
    id: 118,
    number: "Q18",
    name: "Smallest of Three Numbers",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to find the smallest of three given numbers.",
    input: "a = 15, b = 8, c = 23",
    output: "8",
    constraints: "-10^9 <= a, b, c <= 10^9",
    example: "8 is smaller than 15 and 23."
  },
  {
    id: 119,
    number: "Q19",
    name: "Sum of Two Integers",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to read two integers and print their sum.",
    input: "a = 12, b = 18",
    output: "30",
    constraints: "-10^9 <= a, b <= 10^9",
    example: "12 + 18 = 30."
  },
  {
    id: 120,
    number: "Q20",
    name: "Vowel or Consonant Check",
    pattern: "BASIC PROGRAMMING",
    difficulty: "Easy",
    question: "Write a program to check if a given alphabetic character is a Vowel or a Consonant.",
    input: "char = 'E'",
    output: "Vowel",
    constraints: "Alphabet character (A-Z, a-z)",
    example: "'E' is one of (A, E, I, O, U), so output is Vowel."
  }
];

// ==========================================
// 2ND YEAR TRACK (Sophomore Track)
// 25 Pattern Problems (Q1 - Q25)
// ==========================================
export const QUESTIONS_2ND_YEAR = [
  // --- EASY PATTERNS ---
  {
    id: 201,
    number: "Q1",
    name: "Left Half Star Pyramid",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a right-aligned (left half) pyramid of stars for the given input n.",
    input: "n = 5",
    output: `        *
      * *
    * * *
  * * * *
* * * * *`,
    constraints: "1 <= n <= 20",
    example: "Right-aligned triangle with leading spaces."
  },
  {
    id: 202,
    number: "Q2",
    name: "Diamond Pattern of Stars",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a diamond shape pattern of stars with top width n.",
    input: "n = 4",
    output: `   *
  * *
 * * *
* * * *
 * * *
  * *
   *`,
    constraints: "1 <= n <= 20",
    example: "Upper pyramid of n rows followed by inverted pyramid of (n-1) rows."
  },
  {
    id: 203,
    number: "Q3",
    name: "Floyd's Binary Triangle",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a binary triangle where numbers alternate between 1 and 0 across all positions.",
    input: "n = 5",
    output: `1
0 1
1 0 1
0 1 0 1
1 0 1 0 1`,
    constraints: "1 <= n <= 20",
    example: "If (row + col) is even, print 1; else print 0."
  },
  {
    id: 204,
    number: "Q4",
    name: "Hollow Square of Stars",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a hollow n x n square boundary of stars.",
    input: "n = 5",
    output: `* * * * *
*       *
*       *
*       *
* * * * *`,
    constraints: "n >= 2",
    example: "Stars on borders only, hollow inside."
  },

  // --- MEDIUM PATTERNS ---
  {
    id: 205,
    number: "Q5",
    name: "Centered Binary Pyramid",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a centered pyramid with alternating 1 and 0 binary elements.",
    input: "n = 4",
    output: `   1
  0 1
 1 0 1
0 1 0 1`,
    constraints: "1 <= n <= 20",
    example: "Centered pyramid with alternating binary numbers."
  },
  {
    id: 206,
    number: "Q6",
    name: "Inverted Odd Star Pyramid",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print an inverted centered pyramid of odd star counts starting from width n down to 1.",
    input: "n = 9",
    output: `*********
 *******
  *****
   ***
    *`,
    constraints: "n is an odd integer >= 1",
    example: "Rows decrease by 2 stars with increasing leading space."
  },
  {
    id: 207,
    number: "Q7",
    name: "Double-Center Diamond",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a centered diamond pattern having two identical maximum width rows in the middle.",
    input: "n = 10",
    output: `    *
   ***
  *****
 *******
*********
*********
 *******
  *****
   ***
    *`,
    constraints: "n is an even integer (10 rows total)",
    example: "5 rows expanding (1,3,5,7,9) followed by 5 rows contracting (9,7,5,3,1)."
  },
  {
    id: 208,
    number: "Q8",
    name: "Decreasing Number Triangle",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a decreasing number triangle starting each row from n down to (n - row + 1).",
    input: "n = 7",
    output: `7
7 6
7 6 5
7 6 5 4
7 6 5 4 3
7 6 5 4 3 2
7 6 5 4 3 2 1`,
    constraints: "1 <= n <= 9",
    example: "Row 1 starts with 7; each subsequent row counts down one more number."
  },
  {
    id: 209,
    number: "Q9",
    name: "Right-Shifted Alphabet Triangle",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print an inverted alphabet triangle shifted to the right with leading spaces.",
    input: "n = 5",
    output: `A B C D E
  A B C D
    A B C
      A B
        A`,
    constraints: "1 <= n <= 26",
    example: "Alphabets A through E diminishing from the right with indentations."
  },
  {
    id: 210,
    number: "Q10",
    name: "Even Numbers Floyd's Pyramid",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print consecutive even numbers in a centered pyramid formation.",
    input: "n = 4",
    output: `      2
    4   6
   8  10  12
 14  16  18  20`,
    constraints: "1 <= n <= 8",
    example: "Continuous even numbers starting from 2 placed in centered pyramid rows."
  },
  {
    id: 211,
    number: "Q11",
    name: "'X' Shape Star Pattern",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print an 'X' diagonal cross shape pattern of stars for the given odd dimension n.",
    input: "n = 5",
    output: `*   *
 * *
  *
 * *
*   *`,
    constraints: "n is an odd integer >= 3",
    example: "Stars appear on main diagonal (i == j) and anti-diagonal (i + j == n - 1)."
  },

  // --- HARD PATTERNS ---
  {
    id: 212,
    number: "Q12",
    name: "Palindromic Number Crown",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a palindromic number crown / butterfly number pattern.",
    input: "n = 4",
    output: `1      1
12    21
123  321
12344321`,
    constraints: "1 <= n <= 9",
    example: "Left ascending numbers and right descending numbers separated by shrinking spaces."
  },
  {
    id: 213,
    number: "Q13",
    name: "Hourglass Star Pattern",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print an hourglass pattern of stars with top and bottom width n.",
    input: "n = 8",
    output: `* * * * * * * *
  * * * * * *
    * * * *
      * *
       *
      * *
    * * * *
  * * * * * *
* * * * * * * *`,
    constraints: "1 <= n <= 20",
    example: "Inverted pyramid converging to a single point, then expanding downward."
  },
  {
    id: 214,
    number: "Q14",
    name: "Step Staircase Double-Row Pattern",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a staircase pattern where every step consists of two identical width rows of stars.",
    input: "n = 6",
    output: `* *
* *
* * * *
* * * *
* * * * * *
* * * * * *`,
    constraints: "n is an even integer >= 2",
    example: "Rows 1-2 have 2 stars, rows 3-4 have 4 stars, rows 5-6 have 6 stars."
  },
  {
    id: 215,
    number: "Q15",
    name: "'Z' Shape Star Pattern",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a 'Z' shape letter pattern of stars for the given dimension n.",
    input: "n = 5",
    output: `* * * * *
      *
    *
  *
* * * * *`,
    constraints: "n >= 3",
    example: "Top and bottom full rows with anti-diagonal stars connecting them."
  },

  // --- EXTRA ADVANCED PATTERNS (Q16 - Q20 & Beyond) ---
  {
    id: 216,
    number: "Q16",
    name: "Right Arrow / Slanted Chevron",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a right-pointing arrow / slanted chevron star pattern.",
    input: "n = 5",
    output: `*
 * *
  * * *
   * * * *
    * * * * *
   * * * *
  * * *
 * *
*`,
    constraints: "1 <= n <= 15",
    example: "Top half shifts right with increasing stars; bottom half contracts back to the left."
  },
  {
    id: 217,
    number: "Q17",
    name: "Hollow Inverted Right Triangle",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a hollow inverted right triangle of stars.",
    input: "n = 5",
    output: `* * * * *
*     *
*   *
* *
*`,
    constraints: "1 <= n <= 20",
    example: "Top full row, vertical left wall, and diagonal hypotenuse."
  },
  {
    id: 218,
    number: "Q18",
    name: "Half Diamond Number Triangle",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a half-diamond number triangle expanding up to n and contracting to 1.",
    input: "n = 7",
    output: `1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
1 2 3 4 5 6
1 2 3 4 5 6 7
1 2 3 4 5 6
1 2 3 4 5
1 2 3 4
1 2 3
1 2
1`,
    constraints: "1 <= n <= 9",
    example: "Rows 1 to 7 print (1..i), then rows 8 to 13 print (1..14-i)."
  },
  {
    id: 219,
    number: "Q19",
    name: "Hollow Star Pyramid",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a hollow pyramid of stars with a solid base for the given height n.",
    input: "n = 8",
    output: `       *
      * *
     *   *
    *     *
   *       *
  *         *
 *           *
***************`,
    constraints: "n >= 3",
    example: "Only the left slope, right slope, and bottom base contain stars."
  },
  {
    id: 220,
    number: "Q20",
    name: "Centered Number Pyramid",
    pattern: "PATTERN",
    difficulty: "Medium",
    question: "Write a program to print a centered pyramid of numbers (1..i) for height n.",
    input: "n = 6",
    output: `     1
    1 2
   1 2 3
  1 2 3 4
 1 2 3 4 5
1 2 3 4 5 6`,
    constraints: "1 <= n <= 9",
    example: "Centered rows with numbers 1 through row index."
  },
  {
    id: 221,
    number: "Q21",
    name: "Repeated Alphabet Triangle",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print repeated alphabet characters in a right-angled triangle.",
    input: "n = 5",
    output: `A
B B
C C C
D D D D
E E E E E`,
    constraints: "1 <= n <= 26",
    example: "Row i prints the i-th uppercase English letter i times."
  },
  {
    id: 222,
    number: "Q22",
    name: "Pascal's Number Triangle",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print Pascal's Triangle up to n rows.",
    input: "n = 5",
    output: `    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1`,
    constraints: "1 <= n <= 15",
    example: "Each number is the sum of the two numbers directly above it."
  },
  {
    id: 223,
    number: "Q23",
    name: "Right-Leaning Rhombus",
    pattern: "PATTERN",
    difficulty: "Easy",
    question: "Write a program to print a right-leaning parallelogram/rhombus of stars.",
    input: "n = 5",
    output: `*****
 *****
  *****
   *****
    *****`,
    constraints: "1 <= n <= 20",
    example: "Each row of n stars is shifted right by one space."
  },
  {
    id: 224,
    number: "Q24",
    name: "'A' Alphabet Star Pattern",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print the uppercase letter 'A' using stars.",
    input: "n = 5",
    output: `* * * * *
*       *
* * * * *
*       *
*       *`,
    constraints: "n >= 3",
    example: "Top horizontal bar, middle horizontal crossbar, and two vertical legs."
  },
  {
    id: 225,
    number: "Q25",
    name: "Alternating Star & Dash Diamond",
    pattern: "PATTERN",
    difficulty: "Hard",
    question: "Write a program to print a centered diamond pattern alternating between stars (*) and dashes (-).",
    input: "n = 5",
    output: `    *
   --
  ***
 -----
*******
 -----
  ***
   --
    *`,
    constraints: "n >= 3",
    example: "Odd rows use stars and even rows use dashes in a centered diamond shape."
  }
];

// Unified helper function returning questions for the active academic track
// - 1st Year: Exactly 20 questions (10 Patterns + 10 Basic Programming)
// - 2nd Year: Exactly 25 questions (All Patterns from Easy to Extra)
export function getQuestionsForYear(year) {
  const y = String(year || "").trim().toLowerCase();
  if (y.includes("1") || y.includes("first")) {
    return QUESTIONS_1ST_YEAR; // Exactly 20 questions
  }
  return QUESTIONS_2ND_YEAR; // Exactly 25 questions
}

// Fallback legacy export
export const QUESTIONS_DATA = QUESTIONS_2ND_YEAR;
