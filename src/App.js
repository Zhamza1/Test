import React, { useState, useEffect } from 'react';
/* import axios from 'axios';
import Web3 from 'web3'; */
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { CardMedia } from '@mui/material';
import './App.css';

const Marketplace = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);


  // En haut de votre fichier Marketplace, après les imports
const Header = () => (
  <header style={{ padding: '20px 0', backgroundColor: '#123456', color: '#ffffff', textAlign: 'center' }}>
    <Typography variant="h4" component="h1" style={{ color: '#ffffff' }}>
      Nifty Bazaar
    </Typography>
    <nav>
      {/* Ici, ajoutez vos liens de navigation si nécessaire */}
    </nav>
  </header>
);


// En bas de votre fichier Marketplace, avant l'export du composant
const Footer = () => (
  <footer style={{ padding: '20px 0', backgroundColor: '#123456', color: '#ffffff', textAlign: 'center', marginTop: 'auto' }}>
    <Typography variant="body1">
      © 2024 Nifty Bazaar
    </Typography>
    {/* Ajoutez des liens vers les réseaux sociaux ou d'autres sections ici */}
  </footer>
);

  

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const _web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(_web3);

        const accounts = await _web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = '0xbFD5E24e90B9cDe2304b278372DE909abc0f5Cd6'; // Replace with your actual contract address
        const contractABI = [
          [
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "_buyer",
                  "type": "address"
                }
              ],
              "name": "issueRefund",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "seller",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                }
              ],
              "name": "ItemListed",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                }
              ],
              "name": "ItemRemoved",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                }
              ],
              "name": "ItemSold",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                }
              ],
              "name": "ItemUpdated",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "_price",
                  "type": "uint256"
                }
              ],
              "name": "listItem",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
                }
              ],
              "name": "purchaseItem",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                }
              ],
              "name": "RefundIssued",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
                }
              ],
              "name": "removeItem",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "_price",
                  "type": "uint256"
                }
              ],
              "name": "updateItem",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "withdrawFunds",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getItemCount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "itemCount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "items",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "seller",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "pendingWithdrawals",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]          
        ];
        const _contract = new _web3.eth.Contract(contractABI, contractAddress);
        setContract(_contract);

        const itemCount = await _contract.methods.getItemCount().call();
        const _items = [];
        for (let i = 1; i <= itemCount; i++) {
          const item = await _contract.methods.items(i).call();
          _items.push(item);
        }
        setItems(_items);
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const handleAddItem = async () => {
    window.alert(itemPrice.toString());
    await contract.methods.listItem(itemName, '', web3.utils.toWei(itemPrice.toString(), 'ether')).send({
      from: account,
    });
    // Implement the add item functionality using contract.methods.listItem()
    // You'll need to handle the transaction results
    /*try {
      await contract.methods.listItem(itemName, '', web3.utils.toWei(itemPrice.toString(), 'ether')).send({
        from: account,
      });
      // Add logic for handling success
    } catch (error) {
      console.error('Error adding item:', error);
      // Add logic for handling error
    }*/
  };

  const handlePurchase = async () => {
    // Implement the purchase functionality using contract.methods.purchaseItem()
    // You'll need to pass the selectedItemId and handle the transaction results
  };

  const handleUpdateItem = async () => {
    // Implement the update item functionality using contract.methods.updateItem()
    // You'll need to pass the selectedItemId, itemName, itemPrice, and handle the transaction results
  };

  const handleRemoveItem = async () => {
    // Implement the remove item functionality using contract.methods.removeItem()
    // You'll need to pass the selectedItemId and handle the transaction results
  };

  const createWallet = async () => {
    try {

      const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmQi1UenBOb0hBVGhwT2J4aW9qTDBrdm83MldmRzRXRXh1eFpiaXlGQUhzIn0.eyJleHAiOjE3MDk4MjAwMzcsImlhdCI6MTcwOTgxOTY3NywianRpIjoiNDAzMWZkMmEtNWEzMy00NjI5LTk0NzctNWNjNzIzZjQ3NzBkIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi1zYW5kYm94LnZlbmx5LmlvL2F1dGgvcmVhbG1zL0Fya2FuZSIsImF1ZCI6IkFya2FuZU1hcmtldCIsInN1YiI6IjMyOGMxY2U2LWI5NjgtNGExMy1hMmRiLWYzMGI5MGJmOGI5ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImQ4Y2MxY2ZlLWY5OGEtNDBlNS1hYTEwLTM4YjM1ZDhiYmEyYSIsInNlc3Npb25fc3RhdGUiOiI3NmQwOTM1ZC03NjA5LTQxNTAtOWI5NC03NzA0MDRkMTYyN2IiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIk1hcmtldCBBUEkiXX0sInJlc291cmNlX2FjY2VzcyI6eyJBcmthbmVNYXJrZXQiOnsicm9sZXMiOlsiY3JlYXRlOnN1Yi11c2VyIiwiYnV5OnNhbGUiLCJjcmVhdGU6YXVjdGlvbiIsImNyZWF0ZTpiaWQiLCJjcmVhdGU6c3VidXNlci1hZGRyZXNzIiwiY3JlYXRlOnNhbGUiXX19LCJzY29wZSI6IiIsImNvbXBhbmllcyI6W3siaWQiOiIxMWY0ODk0MS1hMmYxLTRhMWQtODM0NS1jMzEwYjIxNWQ1NTQiLCJuYW1lIjoiYm5wIn1dLCJjbGllbnRJZCI6ImQ4Y2MxY2ZlLWY5OGEtNDBlNS1hYTEwLTM4YjM1ZDhiYmEyYSIsImNsaWVudEhvc3QiOiIyMTcuMjYuMjA0LjI0NCIsImNsaWVudEFkZHJlc3MiOiIyMTcuMjYuMjA0LjI0NCJ9.GPuv1qGpph_45fNEnHXNx3cOML_RJaCruETEVfT1OHqBkAdPgl6DaAX7KD5liBRjOTR6gsZVNxT5aYLPt2qx2qhF7C6m4yMhgJGm1xjld-Ip6LmBTkEWhxajjKTe8i9BzTQeo2Bu8_ngGC86kIvpT4hw2V1pRP6sCSxjrOoKOC-u0mdnAJ9UhXs2beWxxAozX5xvlwDst4vEnBqEY4H7jd2ZUhk9lojhx21lKGXFJSwAsx22S1Osls8A7e8kUvz96L1h1pc-wK24ssoRmn3G-IZ-q2dKDN0et-DuJRZQGFRvk3Nmgx09GzU_hfPVCCLsQ07esFjL6isBVKs1z2b9xQ';
      // Effectue la requête POST pour créer un wallet
      const response = await axios.post(
        '/api/wallets',
        {
          secretType: 'ETH',
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      // Récupère les informations du wallet créé depuis la réponse
      const walletId = response.data.result.id;
      const walletAddress = response.data.result.address;
      const walletSecretType = response.data.result.secretType;

      // Tu peux maintenant utiliser ces informations comme tu le souhaites dans ton composant
      console.log('Wallet created successfully:', walletId, walletAddress, walletSecretType);
    } catch (error) {
      console.error('Error creating wallet:', error);
      // Ajoute une logique pour gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  };

  return (
    <div>
    <Header />
    <Container>
      <Typography variant="h3" gutterBottom>Decentralized NFT Marketplace</Typography>
      <Typography variant="body1">Connected Account: {account}</Typography>

      <Grid container spacing={4} style={{ marginTop: '20px' }}>
        {items.map((item) => (
        <Grid item key={item.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={item.image} // Assurez-vous que chaque 'item' a une propriété 'image' avec l'URL de l'image.
              alt={item.name}
            />
            <CardContent>
              <Typography variant="h5" component="div">{item.name}</Typography>
              <Typography variant="body2">{item.price} ETH</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelectedItemId(item.id)}>Purchase</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      </Grid>

      <form style={{ marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom>Add Item</Typography>
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Item Price (ETH)"
          variant="outlined"
          fullWidth
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
      </form>


{/* Update item form */}
      <Typography variant="h4">Update Item</Typography>
<FormControl fullWidth>
  <InputLabel id="update-item-select-label">Select Item</InputLabel>
  <Select
    labelId="update-item-select-label"
    id="update-item-select"
    value={selectedItemId}
    label="Select Item"
    onChange={(e) => setSelectedItemId(e.target.value)}
  >
    {items.map((item) => (
      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
    ))}
  </Select>
</FormControl>
<TextField
  margin="normal"
  fullWidth
  label="New Item Name"
  variant="outlined"
  value={itemName}
  onChange={(e) => setItemName(e.target.value)}
/>
<TextField
  margin="normal"
  fullWidth
  label="New Item Price (ETH)"
  variant="outlined"
  type="number"
  value={itemPrice}
  onChange={(e) => setItemPrice(e.target.value)}
/>
<Button variant="contained" color="primary" onClick={handleUpdateItem}>Update Item</Button>


      {/* Remove item form */}
<Typography variant="h4">Remove Item</Typography>
<FormControl fullWidth>
  <InputLabel id="remove-item-select-label">Select Item</InputLabel>
  <Select
    labelId="remove-item-select-label"
    id="remove-item-select"
    value={selectedItemId}
    label="Select Item"
    onChange={(e) => setSelectedItemId(e.target.value)}
  >
    {items.map((item) => (
      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
    ))}
  </Select>
</FormControl>
<Button variant="contained" color="secondary" onClick={handleRemoveItem} style={{ marginTop: '20px' }}>Remove Item</Button>


      <Typography variant="h4">Purchase Item</Typography>
<FormControl fullWidth>
  <InputLabel id="purchase-item-select-label">Select Item</InputLabel>
  <Select
    labelId="purchase-item-select-label"
    id="purchase-item-select"
    value={selectedItemId}
    label="Select Item"
    onChange={(e) => {
      setSelectedItemId(e.target.value);
      const selectedItem = items.find(item => item.id === e.target.value);
      setItemPrice(web3.utils.fromWei(selectedItem.price, 'ether'));
    }}
  >
    {items.map((item) => (
      <MenuItem key={item.id} value={item.id}>{item.name} - {web3.utils.fromWei(item.price, 'ether')} ETH</MenuItem>
    ))}
  </Select>
</FormControl>
<Button variant="contained" color="success" onClick={handlePurchase} style={{ marginTop: '20px' }}>Purchase Item</Button>

    </Container>
    <Footer />
    </div>
  );
};

export default Marketplace;
