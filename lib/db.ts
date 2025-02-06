import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy, arrayUnion } from 'firebase/firestore';
import { Chat, Message } from '@/types/chat';

export async function createChat(userId: string, firstMessage: string, model: string) {
  try {
    console.log('Creating chat for user:', userId);
    const chat: Omit<Chat, 'id'> = {
      title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
      messages: [{
        id: Date.now().toString(),
        role: 'user',
        content: firstMessage,
        timestamp: Date.now()
      }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
      model
    };

    console.log('Chat object:', chat);
    const docRef = await addDoc(collection(db, 'chats'), chat);
    console.log('Chat created with ID:', docRef.id);
    return { id: docRef.id, ...chat };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

export async function getUserChats(userId: string) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
}

export async function addMessageToChat(chatId: string, message: Omit<Message, 'id'>) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const newMessage = {
      id: Date.now().toString(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      ...(message.reasoning_content ? { reasoning_content: message.reasoning_content } : {})
    };
    
    await updateDoc(chatRef, {
      messages: arrayUnion(newMessage),
      updatedAt: Date.now()
    });

    return newMessage;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

export async function deleteChat(chatId: string) {
  try {
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
} 