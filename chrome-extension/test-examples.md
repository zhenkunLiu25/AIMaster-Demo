# Task Type Detection Examples

The extension now intelligently detects task types from titles. Here are examples:

## Assignments
- "Assignment 1: Data Structures" → **Assignment**
- "Homework 3 - Algorithms" → **Assignment**
- "A2: Machine Learning" → **Assignment**
- "Problem Set 4" → **Assignment**
- "HW5 Due Friday" → **Assignment**

## Exams
- "Midterm Exam" → **Midterm**
- "Mid-term Test" → **Midterm** 
- "MT: Data Structures" → **Midterm**
- "Final Exam CS1010" → **Final Exam**
- "CA1 Assessment" → **Exam**
- "Exam 2: Algorithms" → **Exam**

## Projects
- "Final Project Presentation" → **Project**
- "Group Project Report" → **Project**
- "Capstone Project" → **Project**
- "Team Project Submission" → **Project**

## Quizzes
- "Quiz 1: Introduction" → **Quiz**
- "Pop Quiz Friday" → **Quiz**
- "Mini Test Chapter 5" → **Quiz**

## Labs
- "Lab 3: Database Design" → **Lab**
- "Laboratory Exercise 2" → **Lab**
- "Practical Session 4" → **Lab**

## Discussions
- "Tutorial 1" → **Discussion**
- "Discussion Forum Week 3" → **Discussion**
- "Workshop: Git Basics" → **Discussion**

The detection is case-insensitive and looks for keywords anywhere in the title.