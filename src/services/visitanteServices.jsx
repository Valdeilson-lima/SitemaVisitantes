import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export async function cadastrarVisitante(visitanteData) {
    try {
        // Verificar se já existe um visitante com o mesmo nome e telefone no mesmo dia
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const visitantesRef = collection(db, "visitantes");
        const q = query(
            visitantesRef,
            where("nome_completo", "==", visitanteData.nome_completo),
            where("telefone", "==", visitanteData.telefone)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Verificar se existe algum visitante com os mesmos dados
        const visitanteExistente = querySnapshot.docs.find(doc => {
            const data = doc.data();
            if (data.data_cadastro) {
                const dataCadastro = new Date(data.data_cadastro.seconds * 1000);
                dataCadastro.setHours(0, 0, 0, 0);
                return dataCadastro.getTime() === hoje.getTime();
            }
            return false;
        });

        if (visitanteExistente) {
            throw new Error("Já existe um visitante cadastrado com este nome e telefone hoje.");
        }

        // Se não existe duplicata, salvar o novo visitante
        const docRef = await addDoc(collection(db, "visitantes"), {
            ...visitanteData,
            data_cadastro: serverTimestamp(),
            apresentado: false
        });

        return docRef.id;
    } catch (error) {
        console.error("Erro ao cadastrar visitante:", error);
        throw error;
    }
} 