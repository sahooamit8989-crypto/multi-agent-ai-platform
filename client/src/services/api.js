const API_URL = import.meta.env.VITE_API_URL;

// ===============================
// LOGIN
// ===============================
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ===============================
// REGISTER
// ===============================
export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
};

// ===============================
// GET ALL AGENTS
// ===============================
export const getAgents = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/agents`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch agents"
    );
  }

  return data;
};

// ===============================
// GET SINGLE AGENT
// ===============================
export const getAgentById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/agents/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch agent"
    );
  }

  return data;
};

// ===============================
// EXECUTE AGENT
// ===============================
// EXECUTE AGENT
export const executeAgent = async (
  agentId,
  chatId,
  message
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/tasks/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        agentId,
        chatId,
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Agent execution failed"
    );
  }

  return data;
};

// CREATE CHAT
export const createChat = async (agentId, title) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      agentId,
      title,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create chat"
    );
  }

  return data;
};

// GET ALL CHATS
export const getChats = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch chats"
    );
  }

  return data;
};

// GET SINGLE CHAT
export const getChatById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/chats/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch chat"
    );
  }

  return data;
};

// DELETE CHAT
export const deleteChat = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/chats/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete chat"
    );
  }

  return data;
};