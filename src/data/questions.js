// QUESTION POOLS FOR RENAISSANCE 2026 (1st Year & 2nd Year Tracks)

// ==========================================
// 1ST YEAR TRACK (Freshers / Novice Track)
// Topics: C Programming, Basic Logic, Python/Web Basics, Flow of Control, Arrays, Rapid Fire
// ==========================================
export const QUESTIONS_1ST_YEAR = [
  {
    id: 101,
    number: "Q1",
    name: "Palindrome Number",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Write a program or logic in C/Python to check whether a given positive integer `n` is a palindrome (reads the same forwards and backwards).",
    input: "n = 121",
    output: "true (121 is a Palindrome)",
    constraints: "0 <= n <= 10^9",
    example: "Reversing 121 gives 121."
  },
  {
    id: 102,
    number: "Q2",
    name: "Pre vs Post Increment",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Easy",
    question: "What will be the exact output of this C code snippet considering pre-increment and post-increment operators?",
    code: `#include <stdio.h>

int main() {
    int a = 5;
    int b = a++ + ++a;
    printf("a = %d, b = %d\\n", a, b);
    return 0;
}`,
    output: "a = 7, b = 12",
    explanation: "First `a++` yields 5 (then a becomes 6). Then `++a` increments a to 7 and yields 7. 5 + 7 = 12, and final a is 7."
  },
  {
    id: 103,
    number: "Q3",
    name: "Primary Storage",
    pattern: "MCQ",
    difficulty: "Easy",
    question: "Which type of computer memory is volatile and directly accessible by the CPU for executing running programs?",
    options: [
      { key: "A", text: "ROM (Read-Only Memory)" },
      { key: "B", text: "RAM (Random Access Memory)" },
      { key: "C", text: "Hard Disk Drive (HDD)" },
      { key: "D", text: "Flash SSD Storage" }
    ],
    correctAnswer: "B",
    explanation: "RAM is high-speed volatile memory that holds code and data actively used by the processor."
  },
  {
    id: 104,
    number: "Q4",
    name: "Missing Format Specifier",
    pattern: "DEBUGGING",
    difficulty: "Easy",
    question: "Find the compilation/runtime mistake in this C snippet taking input from the user and printing their age.",
    code: `#include <stdio.h>

int main() {
    int age;
    printf("Enter age: ");
    scanf("%d", age); // Bug here!
    printf("Your age is: %d", age);
    return 0;
}`,
    bugDescription: "`scanf` requires the memory address `&age` instead of the raw variable value `age`.",
    solution: "Change `scanf(\"%d\", age);` to `scanf(\"%d\", &age);`"
  },
  {
    id: 105,
    number: "Q5",
    name: "Sum of Natural Numbers",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Given an integer `N`, find the sum of first `N` natural numbers in O(1) time without using loops.",
    input: "N = 10",
    output: "55",
    constraints: "1 <= N <= 10^6",
    example: "Formula: Sum = N * (N + 1) / 2 = 10 * 11 / 2 = 55."
  },
  {
    id: 106,
    number: "Q6",
    name: "Binary Conversion",
    pattern: "THEORY",
    difficulty: "Easy",
    question: "How do you convert the decimal number (25)₁₀ into its equivalent 8-bit binary representation?",
    details: "Divide by 2 repeatedly and record remainders from bottom to top:\n25 / 2 = 12 (rem 1)\n12 / 2 = 6 (rem 0)\n6 / 2 = 3 (rem 0)\n3 / 2 = 1 (rem 1)\n1 / 2 = 0 (rem 1)\nBinary: 00011001"
  },
  {
    id: 107,
    number: "Q7",
    name: "String Length in C",
    pattern: "MCQ",
    difficulty: "Easy",
    question: "What character signifies the end of a character array (string) in the C programming language?",
    options: [
      { key: "A", text: "'\\n' (Newline)" },
      { key: "B", text: "'\\0' (Null Terminator)" },
      { key: "C", text: "'EOF' (End of File)" },
      { key: "D", text: "';' (Semicolon)" }
    ],
    correctAnswer: "B",
    explanation: "Strings in C are null-terminated character sequences ending with '\\0' (ASCII 0)."
  },
  {
    id: 108,
    number: "Q8",
    name: "Infinite While Loop",
    pattern: "DEBUGGING",
    difficulty: "Easy",
    question: "Why does the following loop run indefinitely? Identify the fix.",
    code: `#include <stdio.h>

int main() {
    int i = 1;
    while (i <= 5) {
        printf("%d ", i);
        // missing step
    }
    return 0;
}`,
    bugDescription: "Variable `i` is never incremented inside the loop body, keeping `i <= 5` permanently true.",
    solution: "Add `i++;` inside the while loop body."
  },
  {
    id: 109,
    number: "Q9",
    name: "Python List Slicing",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Easy",
    question: "What will be the output of the following Python slice operation?",
    code: `languages = ["C", "C++", "Java", "Python", "Rust"]
print(languages[1:4])`,
    output: "['C++', 'Java', 'Python']",
    explanation: "Python slicing `[start:stop]` includes index 1 up to (but not including) index 4."
  },
  {
    id: 110,
    number: "Q10",
    name: "HTTP Protocol",
    pattern: "RAPID FIRE",
    difficulty: "Easy",
    question: "What does the standard web acronym 'HTTP' stand for?",
    answer: "Hypertext Transfer Protocol",
    details: "HTTP is the application-level protocol used for transmitting hypermedia documents like HTML on the World Wide Web."
  },
  {
    id: 111,
    number: "Q11",
    name: "Even or Odd Bitwise",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Determine whether an integer `n` is Even or Odd using bitwise AND (`&`) operator instead of modulus (`%`).",
    input: "n = 42",
    output: "Even",
    constraints: "-10^9 <= n <= 10^9",
    example: "If `(n & 1) == 0` it is Even; if `(n & 1) == 1` it is Odd."
  },
  {
    id: 112,
    number: "Q12",
    name: "HTML Page Title",
    pattern: "MCQ",
    difficulty: "Easy",
    question: "Which HTML tag is used inside the `<head>` section to define the title shown on browser tabs?",
    options: [
      { key: "A", text: "<header>" },
      { key: "B", text: "<title>" },
      { key: "C", text: "<h1>" },
      { key: "D", text: "<meta title>" }
    ],
    correctAnswer: "B",
    explanation: "The `<title>` tag specifies the webpage document title."
  },
  {
    id: 113,
    number: "Q13",
    name: "Array Index Out of Bounds",
    pattern: "DEBUGGING",
    difficulty: "Easy",
    question: "Identify the memory boundary bug in the following C code traversing an array of size 5.",
    code: `int arr[5] = {10, 20, 30, 40, 50};
for (int i = 0; i <= 5; i++) {
    printf("%d ", arr[i]);
}`,
    bugDescription: "The loop condition `i <= 5` attempts to access `arr[5]`, which is outside valid indices (0 to 4).",
    solution: "Change the loop condition to `i < 5`."
  },
  {
    id: 114,
    number: "Q14",
    name: "Ternary Operator",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Easy",
    question: "What will the following C code print?",
    code: `#include <stdio.h>

int main() {
    int x = 10, y = 20;
    int max = (x > y) ? x : y;
    printf("Max = %d", max);
    return 0;
}`,
    output: "Max = 20",
    explanation: "The condition `10 > 20` evaluates to false, so the expression evaluates to `y` (20)."
  },
  {
    id: 115,
    number: "Q15",
    name: "Swap Without Temp",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Write logic to swap two variables `a` and `b` in-place without using any third temporary variable.",
    input: "a = 5, b = 9",
    output: "a = 9, b = 5",
    constraints: "Using arithmetic (+, -) or XOR (^)",
    example: "a = a + b; b = a - b; a = a - b; (or a ^= b; b ^= a; a ^= b;)"
  },
  {
    id: 116,
    number: "Q16",
    name: "What is an Algorithm?",
    pattern: "THEORY",
    difficulty: "Easy",
    question: "Define what an Algorithm is in computer science and name two of its key properties.",
    details: "An Algorithm is a finite, step-by-step unambiguous set of instructions designed to perform a specific task or solve a computational problem. Key properties: Input, Output, Definiteness, Finiteness, Effectiveness."
  },
  {
    id: 117,
    number: "Q17",
    name: "Git Version Control",
    pattern: "RAPID FIRE",
    difficulty: "Easy",
    question: "Which terminal command is used to initialize a brand new Git repository in the current working directory?",
    answer: "git init",
    details: "`git init` creates a hidden `.git` directory containing all version control metadata and tracking structures."
  },
  {
    id: 118,
    number: "Q18",
    name: "C Data Types Size",
    pattern: "MCQ",
    difficulty: "Easy",
    question: "In standard 32/64-bit C compilers, what is the typical memory size of a `char` variable?",
    options: [
      { key: "A", text: "1 Byte (8 bits)" },
      { key: "B", text: "2 Bytes (16 bits)" },
      { key: "C", text: "4 Bytes (32 bits)" },
      { key: "D", text: "8 Bytes (64 bits)" }
    ],
    correctAnswer: "A",
    explanation: "In C, `sizeof(char)` is defined by standard to be strictly 1 byte."
  },
  {
    id: 119,
    number: "Q19",
    name: "Fibonacci Sequence",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Generate the first `n` terms of the Fibonacci sequence starting with 0, 1, 1, 2, 3...",
    input: "n = 6",
    output: "0, 1, 1, 2, 3, 5",
    constraints: "1 <= n <= 30",
    example: "Each term is the sum of the previous two terms."
  },
  {
    id: 120,
    number: "Q20",
    name: "Creator of C",
    pattern: "RAPID FIRE",
    difficulty: "Easy",
    question: "Who is celebrated as the creator and original designer of the C programming language at Bell Labs?",
    answer: "Dennis Ritchie",
    details: "Dennis Ritchie developed the C language between 1969 and 1973 at Bell Laboratories to create the Unix operating system."
  }
];

// ==========================================
// 2ND YEAR TRACK (Sophomore / Advanced Track)
// Topics: DSA, OOP, DBMS, OS, Advanced Debugging, RSA Cryptography, Rapid Fire
// ==========================================
export const QUESTIONS_2ND_YEAR = [
  {
    id: 201,
    number: "Q1",
    name: "Binary Search",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Given a sorted array of distinct integers `nums` and a target value `target`, return the index if the target is found. If not, return -1 in O(log n) runtime complexity.",
    input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
    output: "4",
    constraints: "1 <= nums.length <= 10^4, nums is sorted in ascending order.",
    example: "Explanation: 9 exists in nums and its index is 4."
  },
  {
    id: 202,
    number: "Q2",
    name: "Async Event Loop",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Medium",
    question: "Analyze the following JavaScript snippet with Promises and Timers. What will be logged to the console in order?",
    code: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});

console.log('5');`,
    output: "1\n5\n3\n4\n2",
    explanation: "Synchronous tasks (1, 5) execute first. Microtasks in the Promise queue (3, then 4) resolve next. Finally, the Macrotask (setTimeout callback 2) runs."
  },
  {
    id: 203,
    number: "Q3",
    name: "OSI Layer Routing",
    pattern: "MCQ",
    difficulty: "Easy",
    question: "At which layer of the OSI model does IP (Internet Protocol) addressing and packet routing primarily operate?",
    options: [
      { key: "A", text: "Data Link Layer (Layer 2)" },
      { key: "B", text: "Network Layer (Layer 3)" },
      { key: "C", text: "Transport Layer (Layer 4)" },
      { key: "D", text: "Session Layer (Layer 5)" }
    ],
    correctAnswer: "B",
    explanation: "The Network Layer (Layer 3) handles logical host addressing (IPv4/IPv6) and path determination (routing)."
  },
  {
    id: 204,
    number: "Q4",
    name: "Off-by-One Loop Bug",
    pattern: "DEBUGGING",
    difficulty: "Medium",
    question: "Identify the critical bug in this C function intended to compute the sum of all elements in an array, and specify the fix.",
    code: `int compute_sum(int arr[], int size) {
    int total = 0;
    // Bug exists in loop condition:
    for (int i = 0; i <= size; i++) {
        total += arr[i];
    }
    return total;
}`,
    bugDescription: "The loop condition `i <= size` causes an Out-of-Bounds Memory read at index `arr[size]`.",
    solution: "Change loop condition to `i < size`."
  },
  {
    id: 205,
    number: "Q5",
    name: "Two Sum Problem",
    pattern: "CODING",
    difficulty: "Medium",
    question: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Target time complexity: O(n) using a Hash Map.",
    input: "nums = [2, 7, 11, 15], target = 9",
    output: "[0, 1]",
    constraints: "2 <= nums.length <= 10^4. Exactly one valid answer exists.",
    example: "Because nums[0] + nums[1] == 9, we return [0, 1]."
  },
  {
    id: 206,
    number: "Q6",
    name: "ACID Properties",
    pattern: "THEORY",
    difficulty: "Medium",
    question: "What does the ACID acronym stand for in Database Management Systems (DBMS)? Explain Atomicity and Durability.",
    details: "ACID = Atomicity, Consistency, Isolation, Durability.\n• Atomicity: All transactions execute completely or not at all (All-or-Nothing).\n• Durability: Once a transaction commits, its state changes survive system crashes."
  },
  {
    id: 207,
    number: "Q7",
    name: "JS Type Coercion",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Medium",
    question: "Predict the exact console output of the following JavaScript type coercions:",
    code: `console.log(1 + "2" + 3);
console.log(4 - "2");
console.log(true + false);
console.log([] + {});`,
    output: "\"123\"\n2\n1\n\"[object Object]\"",
    explanation: "1 + '2' converts to string '12' + 3 = '123'. 4 - '2' coerces to numeric subtraction (2). true(1) + false(0) = 1. [] becomes '' and concatenates with String({})."
  },
  {
    id: 208,
    number: "Q8",
    name: "Deadlock Conditions",
    pattern: "MCQ",
    difficulty: "Hard",
    question: "Which of the following is NOT one of the 4 Coffman conditions required for a Deadlock to occur in Operating Systems?",
    options: [
      { key: "A", text: "Mutual Exclusion" },
      { key: "B", text: "Hold and Wait" },
      { key: "C", text: "Preemption Allowed" },
      { key: "D", text: "Circular Wait" }
    ],
    correctAnswer: "C",
    explanation: "No Preemption is required for deadlock. If preemption is allowed, resources can be forcibly reclaimed, breaking deadlock."
  },
  {
    id: 209,
    number: "Q9",
    name: "Reverse Linked List",
    pattern: "CODING",
    difficulty: "Medium",
    question: "Given the `head` of a singly linked list, reverse the list iteratively in O(n) time and O(1) space, and return the reversed list head.",
    input: "head = [1, 2, 3, 4, 5]",
    output: "[5, 4, 3, 2, 1]",
    constraints: "The number of nodes in the list is in the range [0, 5000].",
    example: "Iterate with 3 pointers: `prev = null`, `curr = head`, `next = null`."
  },
  {
    id: 210,
    number: "Q10",
    name: "SQL Injections",
    pattern: "RAPID FIRE",
    difficulty: "Medium",
    question: "What programming technique with parameterized queries is the primary defense against SQL Injection attacks?",
    answer: "Prepared Statements (Parameterized Queries)",
    details: "Prepared statements ensure user input is treated strictly as data, never as executable SQL code."
  },
  {
    id: 211,
    number: "Q11",
    name: "Valid Parentheses",
    pattern: "CODING",
    difficulty: "Easy",
    question: "Given a string `s` containing just characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid using a Stack in O(n) time.",
    input: "s = \"()[]{}\"",
    output: "true",
    constraints: "1 <= s.length <= 10^4",
    example: "Open brackets must be closed by the same type in correct order."
  },
  {
    id: 212,
    number: "Q12",
    name: "Process vs Thread",
    pattern: "THEORY",
    difficulty: "Medium",
    question: "Explain the fundamental architectural differences between a Process and a Thread regarding memory space and context switching overhead.",
    details: "• Process: An executing program instance with its own independent virtual address space (Heap, Stack, Data). High context switch overhead.\n• Thread: A lightweight unit of execution within a process sharing the same address space and memory. Lower context switch overhead."
  },
  {
    id: 213,
    number: "Q13",
    name: "Dangling Pointer Bug",
    pattern: "DEBUGGING",
    difficulty: "Hard",
    question: "Why is the following C code dangerous and what undefined behavior does it introduce?",
    code: `int* create_array() {
    int buffer[10] = {1, 2, 3};
    return buffer; // Bug!
}

int main() {
    int* ptr = create_array();
    printf("%d", ptr[0]);
    return 0;
}`,
    bugDescription: "`buffer` is allocated on the stack frame of `create_array`. When the function returns, its stack frame is deallocated, making `ptr` a Dangling Pointer.",
    solution: "Allocate dynamically on the heap using `malloc(10 * sizeof(int))` or pass a buffer from caller."
  },
  {
    id: 214,
    number: "Q14",
    name: "Python Scope LEGB",
    pattern: "OUTPUT PREDICTION",
    difficulty: "Medium",
    question: "What will this Python script print when executed?",
    code: `x = 50

def func():
    global x
    x = 2
    def nested():
        x = 99
    nested()

func()
print(x)`,
    output: "2",
    explanation: "`func` modifies the global `x` to 2. Inside `nested`, `x = 99` creates a local variable in `nested`'s scope without affecting global `x`."
  },
  {
    id: 215,
    number: "Q15",
    name: "Time Complexity of Quicksort",
    pattern: "MCQ",
    difficulty: "Medium",
    question: "What is the Worst-Case time complexity of standard QuickSort when an unbalanced pivot is consistently chosen (e.g. already sorted input)?",
    options: [
      { key: "A", text: "O(n log n)" },
      { key: "B", text: "O(n²)" },
      { key: "C", text: "O(log n)" },
      { key: "D", text: "O(n)" }
    ],
    correctAnswer: "B",
    explanation: "When partitions are extremely unbalanced (0 and n-1), recurrence T(n) = T(n-1) + O(n) yields O(n²)."
  },
  {
    id: 216,
    number: "Q16",
    name: "Merge Sorted Arrays",
    pattern: "CODING",
    difficulty: "Easy",
    question: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order. Merge `nums2` into `nums1` as one sorted array in-place.",
    input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
    output: "[1,2,2,3,5,6]",
    constraints: "nums1.length == m + n",
    example: "Use three pointers starting from the end of both arrays."
  },
  {
    id: 217,
    number: "Q17",
    name: "Git Rebase vs Merge",
    pattern: "THEORY",
    difficulty: "Medium",
    question: "What is the core difference between `git merge` and `git rebase` when integrating feature branch changes into main?",
    details: "• `git merge`: Creates a 3-way merge commit preserving the exact branch topology and chronological history.\n• `git rebase`: Re-applies feature commits on top of the base tip, rewriting commit hashes for a clean, linear commit history."
  },
  {
    id: 218,
    number: "Q18",
    name: "HTTP Status Codes",
    pattern: "RAPID FIRE",
    difficulty: "Easy",
    question: "What does HTTP response status code '403' specifically signify?",
    answer: "403 Forbidden",
    details: "403 Forbidden indicates the server understands the request but refuses to authorize access (insufficient permissions)."
  },
  {
    id: 219,
    number: "Q19",
    name: "Null Pointer Exception",
    pattern: "DEBUGGING",
    difficulty: "Medium",
    question: "Spot the runtime flaw in this Java method handling user profile emails.",
    code: `public String getSanitizedEmail(User user) {
    return user.getEmail().trim().toLowerCase();
}`,
    bugDescription: "If `user` is null or `user.getEmail()` returns null, `.trim()` triggers NullPointerException.",
    solution: "Add null checks or optional chaining: `if (user != null && user.getEmail() != null) return user.getEmail().trim().toLowerCase(); return \"\";`"
  },
  {
    id: 220,
    number: "Q20",
    name: "RSA Cryptography",
    pattern: "RAPID FIRE",
    difficulty: "Medium",
    question: "What mathematical computational problem provides the hardness foundation for the security of RSA public-key encryption?",
    answer: "Integer Factorization of large composite semi-primes (multiplying two large prime numbers)",
    details: "RSA relies on the fact that multiplying two large primes is fast, but factoring their product back into primes is computationally infeasible for classical computers."
  }
];

// Default helper to fetch questions by year
export function getQuestionsForYear(year = "2nd Year") {
  if (year === "1st Year" || year === "1" || year === 1) {
    return QUESTIONS_1ST_YEAR;
  }
  return QUESTIONS_2ND_YEAR;
}

// Backwards compatibility default
export const QUESTIONS_DATA = QUESTIONS_2ND_YEAR;
