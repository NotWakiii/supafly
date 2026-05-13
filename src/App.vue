<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const employees = ref([])
const name = ref('')
const position = ref('')
const salary = ref(0)


const fetchEmployees = async () => {
  const { data } = await supabase.from('employees').select('*')
  employees.value = data
}


const addEmployee = async () => {
  if (!name.value) return; 
  await supabase.from('employees').insert([{ 
    name: name.value, 
    position: position.value, 
    salary: salary.value 
  }])
  name.value = ''
  position.value = ''
  salary.value = 0
  fetchEmployees() 
}


const deleteEmployee = async (id) => {
  await supabase.from('employees').delete().eq('id', id)
  fetchEmployees()
}

onMounted(() => {
  fetchEmployees()
})
</script>

<template>
  <div class="container">
    <header class="app-header">
      <h1>Supabase + Vue</h1>
      <p>Employee Database Management</p>
    </header>

    <main>
      
      <section class="card form-card">
        <h2>Add New Record</h2>
        <div class="input-row">
          <input v-model="name" placeholder="Full Name" />
          <input v-model="position" placeholder="Job Title" />
          <input v-model.number="salary" type="number" placeholder="Salary" />
          <button class="add-btn" @click="addEmployee">Add Record</button>
        </div>
      </section>

     
      <section class="list-section">
        <div class="list-header">
          <h2>Team Members</h2>
          <span class="count">{{ employees.length }} total</span>
        </div>

        <div v-if="employees.length === 0" class="empty">
          No employees found in the database.
        </div>

        <ul class="employee-list">
          <li v-for="emp in employees" :key="emp.id" class="employee-item">
            <div class="info">
              <span class="name">{{ emp.name }}</span>
              <span class="position">{{ emp.position }}</span>
            </div>
            <div class="actions">
              <span class="salary">${{ emp.salary.toLocaleString() }}</span>
              <button class="delete-btn" @click="deleteEmployee(emp.id)">Remove</button>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #334155;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin: 0;
}

.app-header p {
  color: #64748b;
  font-size: 1.1rem;
}


.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}


.form-card h2 {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.input-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

input {
  flex: 1;
  min-width: 150px;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover { background: #2563eb; }

/* List Styling */
.list-section { margin-top: 40px; }

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.count {
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.employee-list {
  list-style: none;
  padding: 0;
}

.employee-item {
  background: white;
  margin-bottom: 12px;
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  transition: transform 0.1s;
}

.employee-item:hover {
  transform: scale(1.01);
}

.info { display: flex; flex-direction: column; }

.name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
}

.position {
  color: #64748b;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.salary {
  font-weight: 600;
  color: #10b981;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}

@media (max-width: 600px) {
  .input-row { flex-direction: column; }
  .employee-item { flex-direction: column; align-items: flex-start; gap: 12px; }
  .actions { width: 100%; justify-content: space-between; }
}
</style>