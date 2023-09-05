import Message from '../Models/message';
import archiveChat from '../Models/archivedChat';

const backup = async () => {
    try {
      
        const data:any = await Message.findAll();

        // Create archived chat messages in bulk and this is better than inserting one by one
        await archiveChat.bulkCreate(data);

       
        for (const message of data) {
            await message.destroy();
        }

        console.log('Backup Done', new Date());
    } catch (err) {
        console.error('Backup Error:', err);
    }
}

export default backup;
