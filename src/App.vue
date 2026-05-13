<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from './supabase'

const employees = ref([])
const name = ref('')
const position = ref('')
const salary = ref(0)
const searchQuery = ref('')

const fetchEmployees = async () => {
  const { data } = await supabase.from('employees').select('*').order('id', { ascending: false })
  
  employees.value = data.map(emp => ({ ...emp, isEditing: false }))
}


const filteredEmployees = computed(() => {
  return employees.value.filter(emp => {
    const query = searchQuery.value.toLowerCase()
    return emp.name.toLowerCase().includes(query) || emp.id.toString().includes(query)
  })
})

const addEmployee = async () => {
  if (!name.value) return; 
  await supabase.from('employees').insert([{ 
    name: name.value, 
    position: position.value, 
    salary: salary.value 
  }])
  name.value = ''; position.value = ''; salary.value = 0
  fetchEmployees() 
}


const updateEmployee = async (emp) => {
  const { error } = await supabase
    .from('employees')
    .update({ name: emp.name, position: emp.position, salary: emp.salary })
    .eq('id', emp.id)
  
  if (!error) {
    emp.isEditing = false
    fetchEmployees()
  }
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
          <div class="header-actions">
            <input v-model="searchQuery" placeholder="Search ID or Name..." class="search-bar" />
            <span class="count">{{ filteredEmployees.length }} total</span>
          </div>
        </div>

        <div v-if="filteredEmployees.length === 0" class="empty">
          No employees found matching your search.
        </div>

        <ul class="employee-list">
          <li v-for="emp in filteredEmployees" :key="emp.id" class="employee-item">
            
            
            <div v-if="emp.isEditing" class="input-row" style="width: 100%;">
              <input v-model="emp.name" />
              <input v-model="emp.position" />
              <input v-model.number="emp.salary" type="number" />
              <div class="actions">
                <button class="save-btn" @click="updateEmployee(emp)">Save</button>
                <button class="delete-btn" @click="emp.isEditing = false">Cancel</button>
              </div>
            </div>

            
            <template v-else>
              <div class="info">
                <span class="id-text">#{{ emp.id }}</span>
                <span class="name">{{ emp.name }}</span>
                <span class="position">{{ emp.position }}</span>
              </div>
              <div class="actions">
                <span class="salary">${{ emp.salary.toLocaleString() }}</span>
                <button class="edit-btn" @click="emp.isEditing = true">Edit</button>
                <button class="delete-btn" @click="deleteEmployee(emp.id)">Remove</button>
              </div>
            </template>

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

.app-header { text-align: center; margin-bottom: 40px; }
.app-header h1 { font-size: 2.5rem; color: #1e293b; margin: 0; }
.app-header p { color: #64748b; font-size: 1.1rem; }

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.form-card h2 { font-size: 1.25rem; margin-top: 0; margin-bottom: 20px; }
.input-row { display: flex; gap: 12px; flex-wrap: wrap; }

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
}

.list-section { margin-top: 40px; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }


.header-actions { display: flex; align-items: center; gap: 12px; }
.search-bar { min-width: 200px; padding: 8px 12px; border-width: 2px; }

.count { background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: 600; }

.employee-list { list-style: none; padding: 0; }
.employee-item {
  background: white;
  margin-bottom: 12px;
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.info { display: flex; flex-direction: column; }
.id-text { font-size: 0.7rem; color: #94a3b8; font-weight: bold; }
.name { font-weight: 700; font-size: 1.1rem; color: #0f172a; }
.position { color: #64748b; font-size: 0.9rem; }

.actions { display: flex; align-items: center; gap: 12px; }
.salary { font-weight: 600; color: #10b981; }


.edit-btn {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
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
  .header-actions { width: 100%; }
  .search-bar { width: 100%; }
}
</style>