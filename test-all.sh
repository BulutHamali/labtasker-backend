#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "=== Register User (will fail if exists, that's okay) ==="
curl -s -X POST "$BASE_URL/auth/register" \  -H "Content-Type: application/json" \  -d '{"username":"testuser","email":"testuser@example.com","password":"password123"}'
echo -e "\n"

echo "=== Login User ==="
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \  -H "Content-Type: application/json" \  -d '{"email":"testuser@example.com","password":"password123"}' | jq -r '.token')
echo "Token: $TOKEN"
echo -e "\n"

echo "=== Create Project ==="
PROJECT_ID=$(curl -s -X POST "$BASE_URL/projects" \  -H "Content-Type: application/json" \  -H "Authorization: Bearer $TOKEN" \  -d '{"name":"RNA-seq Analysis","description":"Bioinformatics work"}' | jq -r '._id')
echo "Project ID: $PROJECT_ID"
echo -e "\n"

echo "=== Create Task ==="
TASK_ID=$(curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/tasks" \  -H "Content-Type: application/json" \  -H "Authorization: Bearer $TOKEN" \  -d '{"name":"Analyze RNA-seq Data","dueDate":"2025-08-15"}' | jq -r '._id')
echo "Task ID: $TASK_ID"
echo -e "\n"

echo "=== List Projects ==="
curl -s -X GET "$BASE_URL/projects" \  -H "Authorization: Bearer $TOKEN" | jq
echo -e "\n"

echo "=== List Tasks for Project ==="
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID/tasks" \  -H "Authorization: Bearer $TOKEN" | jq
echo -e "\n"

echo "=== Update Task (mark completed) ==="
curl -s -X PUT "$BASE_URL/projects/tasks/$TASK_ID" \  -H "Content-Type: application/json" \  -H "Authorization: Bearer $TOKEN" \  -d '{"completed":true}' | jq
echo -e "\n"

echo "=== Delete Task ==="
curl -s -X DELETE "$BASE_URL/projects/tasks/$TASK_ID" \  -H "Authorization: Bearer $TOKEN" | jq
echo -e "\n"

echo "=== Confirm Tasks for Project After Deletion ==="
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID/tasks" \  -H "Authorization: Bearer $TOKEN" | jq
echo -e "\n"

echo "=== Done. ==="
