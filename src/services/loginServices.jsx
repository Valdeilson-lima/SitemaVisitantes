
import { collection, addDoc, serverTimestamp, doc, getDoc} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Função para salvar logs no Firestore
export async function salvarLog(usuarioId, nomeUsuario, acao) {
  if (!usuarioId || !nomeUsuario) {
    console.error("Erro: Dados de usuário não fornecidos.");
    return;
  }

  try {
    await addDoc(collection(db, "logs"), {
      usuarioId, // ID do usuário
      nomeUsuario, // Nome do usuário
      acao, // Ação realizada
      data: serverTimestamp() // Timestamp do servidor
    });

    console.log("Log salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar log:", error);
  }
}

// Função auxiliar para buscar o nome do usuário logado no Firestore
export async function buscarNomeUsuario(uid) {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().nome;
    } else {
      console.warn("Usuário não encontrado.");
      return "Desconhecido";
    }
  } catch (error) {
    console.error("Erro ao buscar nome do usuário:", error);
    return "Erro";
  }
}