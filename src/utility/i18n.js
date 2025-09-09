import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_title": "Smart To-Do List",
      "app_subtitle": "Plan, track, and accomplish more with intelligent task management. Turn ideas into action—quickly and efficiently.",
      "new_category": "New category...",
      "add": "Add",
      "add_task": "Add a task",
      "task_title": "Task title",
      "ai_suggest": "AI Suggest",
      "notes": "Notes (optional)",
      "category": "Category",
      "select_category": "Select Category",
      "priority": "Priority",
      "select_priority": "Select Priority",
      "due_date": "Due date",
      "save": "Save",
      "all": "All",
      "manual_order": "Manual order",
      "export_as": "Export As...",
      "import": "Import",
      "edit": "Edit",
      "delete": "Delete",
      "created": "Created",
      "search": "Search tasks...",
      "tips_title": "Tips",
      "tip_1": "Use priority tags to highlight important tasks.",
      "tip_2": "Tasks are saved to localStorage automatically.",
      "tip_3": "Drag items to reorder (manual mode).",
      "thinking": "Thinking",
      "no_tasks_yet_add_one": "No tasks yet — add one !",
      "new_category": "New Category",
      "sort_by_due_date": "Sort by due date",
      "sort_by_priority": "Sort By priority",
      "thinking_of_a_task": "Thinking of a task",
      "uses_as_notes": "Uses as notes",
      "dismiss": "Dismiss",
      "select_order": "Select Order",
      "complete": "Complete",
      "incomplete": "Incomplete"
    }
  },
  es: {
    translation: {
      "app_title": "Lista Inteligente de Tareas",
      "app_subtitle": "Planifica, realiza un seguimiento y completa más tareas con gestión inteligente. Convierte ideas en acción—rápida y eficientemente.",
      "new_category": "Nueva categoría...",
      "add": "Agregar",
      "add_task": "Agregar una tarea",
      "task_title": "Título de la tarea",
      "notes": "Notas (opcional)",
      "category": "Categoría",
      "select_category": "Seleccionar categoría",
      "priority": "Prioridad",
      "select_priority": "Seleccionar prioridad",
      "due_date": "Fecha límite",
      "save": "Guardar",
      "all": "Todas",
      "manual_order": "Orden manual",
      "export_as": "Exportar como...",
      "import": "Importar",
      "edit": "Editar",
      "delete": "Eliminar",
      "created": "Creado",
      "search": "Buscar tareas...",
      "tips_title": "Consejos",
      "tip_1": "Usa etiquetas de prioridad para resaltar tareas importantes.",
      "tip_2": "Las tareas se guardan automáticamente en localStorage.",
      "tip_3": "Arrastra elementos para reordenar (modo manual).",
      "ai_suggest": "Sugerencia de IA",
      "thinking": "Pensamiento",
      "no_tasks_yet_add_one": "Aún no hay tareas: ¡añade una !",
      "new_category": "Nueva categoría",
      "sort_by_due_date": "Trier par date d'échéance",
      "sort_by_priority": "Ordenar por fecha de vencimiento",
      "thinking_of_a_task": "Pensando en una tarea",
      "uses_as_notes": "Usos como notas",
      "dismiss": "Despedir",
      "select_order": "Seleccionar pedido",
      "complete": "Completo",
      "incomplete": "Incompleto"
    }
  },
  fr: {
    translation: {
      "app_title": "Liste de tâches intelligentes",
      "app_subtitle": "Planifiez, suivez et accomplissez plus avec une gestion intelligente des tâches. Transformez les idées en action—rapidement et efficacement.",
      "new_category": "Nouvelle catégorie...",
      "add": "Ajouter",
      "add_task": "Ajouter une tâche",
      "task_title": "Titre de la tâche",
      "ai_suggest": "Suggestion AI",
      "notes": "Notes (optionnel)",
      "category": "Catégorie",
      "select_category": "Sélectionnez une catégorie",
      "priority": "Priorité",
      "select_priority": "Sélectionnez la priorité",
      "due_date": "Date limite",
      "save": "Enregistrer",
      "all": "Toutes",
      "manual_order": "Ordre manuel",
      "export_as": "Exporter en...",
      "import": "Importer",
      "edit": "Modifier",
      "delete": "Supprimer",
      "created": "Créé",
      "search": "Rechercher des tâches...",
      "tips_title": "Conseils",
      "tip_1": "Utilisez des étiquettes de priorité pour mettre en évidence les tâches importantes.",
      "tip_2": "Les tâches sont automatiquement sauvegardées dans localStorage.",
      "tip_3": "Faites glisser les éléments pour réorganiser (mode manuel).",
      "thinking": "Pensée",
      "no_tasks_yet_add_one": "Aucune tâche pour le moment — ajoutez-en une !",
      "new_category": "Nouvelle catégorie",
      "sort_by_due_date": "Trier par date d'échéance",
      "sort_by_priority": "Trier par priorité",
      "thinking_of_a_task": "Penser à une tâche",
      "uses_as_notes": "Utilisations comme notes",
      "dismiss": "Rejeter",
      "select_order": "Sélectionnez la commande",
      "complete": "Complet",
      "incomplete": "Incomplet"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
