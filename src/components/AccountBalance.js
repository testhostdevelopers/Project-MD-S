import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { NotificationManager } from 'react-notifications';
import { Dropdown } from 'reactjs-dropdown-component';
import { connect } from "react-redux";
import Loading from '../components/Loading';
import { updateStatus } from "../store/actions/change.action";
import slogo from "../assets/images/icons/logo.png";
import cryptoLogo from '../assets/images/cryptoLogo.png'
import config from "../config.json";

const { StakingAddress } = config;

const duration = 24 * 25 * 3600;
const locations = [
   {
      label: <span><img src={slogo} width="20px" height="20px" />MSDOGE</span>,
      value: 0,
   },
   {
      label: <span><img src={slogo} width="20px" height="20px" />CRYPTO</span>,
      value: 1,
   }
];

const optionData = [
   {
      label: <span><img src={cryptoLogo} width="18px" height="18px" /> Crypto</span>,
      value: 0,
   },
   {
      label: <span><img src={cryptoLogo} width="18px" height="18px" /> Crypto</span>,
      value: 1,
   }
];

function AccountBalance(props) {
   const { active, account } = useWeb3React();
   const {
      web3,
      dogeB,
      loriaB,
      ethB,
      loriaCoin: _CRYPTO,
      dogeCoin: _MSDOGE,
      stake: _Staking,
      dogeReward: _XMSDOGE,
      loriaReward: _XCRYPTO
   } = props;

   const [counter, setCounter] = useState(1);
   const [_stakedDoge, setStakedDoge] = useState(0);
   const [_stakedLoria, setStakedLoria] = useState(0);
   const [_unClaimedDoge, setUnClaimedDoge] = useState(0);
   const [_unClaimedLoria, setUnClaimedLoria] = useState(0);
   const [isLoading, setLoading] = useState(false);
   const [activeCoin, setCoin] = useState(0);
   const [_stakingAmount, setStakingAmount] = useState('');

   useEffect(async () => {
      if (account) {
         await getStakedList();
      }
   }, [account]);

   const withdraw = async () => {
      setLoading(true);
      try {
         const totalDoge = web3.utils.toWei(_stakedDoge.toString(), 'gwei');
         const totalLoria = web3.utils.toWei(_stakedLoria.toString(), 'mwei');
         let flag = false;
         if (totalDoge > 0) {
            await _XMSDOGE.methods.approve(StakingAddress, totalDoge).send({ from: account });
            // await _MSDOGE.methods.approve(StakingAddress, totalDoge).send({ from: account });
            flag = true;
         }

         if (totalLoria > 0) {
            // await _CRYPTO.methods.approve(StakingAddress, totalLoria).send({ from: account });
            await _XCRYPTO.methods.approve(StakingAddress, totalLoria).send({ from: account });
            flag = true;
         }

         if (flag) {
            await _Staking.methods.allWithdraw().send({ from: account })
               .on('receipt', async (res) => {
                  await props.updateStatus();
                  await getStakedList();
                  NotificationManager.success(":D")
                  setLoading(false);
               })
         }

         else {
            NotificationManager.warning("No staked!", "Warning");
            setLoading(false);
         }

      } catch (err) {
         setLoading(false);
      }
      window.$('#cancelStake').modal('hide');
   }

   const multipleClaim = async () => {
      setLoading(true);
      try {
         const totalDoge = web3.utils.toWei(_unClaimedDoge.toString(), 'gwei');
         const totalLoria = web3.utils.toWei(_unClaimedLoria.toString(), 'mwei');
         let flag = false;
         if (totalDoge > 0) flag = true;
         if (totalLoria > 0) flag = true;

         if (flag) {
            await _Staking.methods.multipleClaim().send({ from: account })
               .on('receipt', async (res) => {
                  await props.updateStatus();
                  await getStakedList();
                  NotificationManager.success(":D")
                  setLoading(false);
               })
         }

         else {
            NotificationManager.warning("No available claim!", "Warning");
            setLoading(false);
         }

      } catch (err) {
         console.log(err);
         setLoading(false);
      }
      window.$('#multiClaimCoinPopup').modal('hide');
      setLoading(false);
   }

   const Staking = async () => {
      if (_stakingAmount < 0.5) {
         NotificationManager.warning("Staking amount must be greater or equal that 0.5");
         return;
      }
      setLoading(true);
      try {
         switch (activeCoin) {
            case 0:
               const dogeAmount = web3.utils.toWei(_stakingAmount.toString(), "gwei");
               await _MSDOGE.methods.approve(StakingAddress, dogeAmount).send({ from: account });
               NotificationManager.info("Approved", "Info");
               await _Staking.methods.stake(activeCoin, dogeAmount, counter).send({ from: account })
                  .on('receipt', async (receipt) => {
                     NotificationManager.success("Success", ":)");
                     await props.updateStatus();
                     await getStakedList();
                     setLoading(false);
                  })
               break;
            case 1:
               const loriaAmount = web3.utils.toWei(_stakingAmount.toString(), "mwei");
               await _CRYPTO.methods.approve(StakingAddress, loriaAmount).send({ from: account });
               NotificationManager.info("Approved", "Info");
               await _Staking.methods.stake(activeCoin, loriaAmount, counter).send({ from: account })
                  .on('receipt', async (receipt) => {
                     NotificationManager.success("Success", ":)");
                     await props.updateStatus();
                     await getStakedList();
                     setLoading(false);
                  })
               break;
         }
      } catch (err) {
         setLoading(false);
      }
      window.$("#stakingModal").modal('hide');
   }

   const getStakedList = async () => {
      const list = await _Staking.methods.getStakedList().call({ from: account });
      const now = await _Staking.methods.getNow().call();

      let stakedDogeAmount = 0,
         stakedLoriaAmount = 0,
         rewardDogeAmount = 0,
         rewardLoriaAmount = 0;

      list.map(item => {
         const updated_at = item._updated_at;

         // let count = Math.floor((now - updated_at) / (duration * item._dogeEli));
         let count = 1;

         if (item._stakedToken == 0) {
            stakedDogeAmount += Number(item._initBalance);
            if (count > 0) rewardLoriaAmount += count * Number(item._initBalance) * Number(item._apy) / 100 / 1000;
         }

         else {
            stakedLoriaAmount += Number(item._initBalance);
            if (count > 0) rewardDogeAmount += count * Number(item._initBalance) * Number(item._apy) / 100 * 1000;
         }

      })

      setStakedDoge(web3.utils.fromWei(stakedDogeAmount.toString(), "gwei"));
      setStakedLoria(web3.utils.fromWei(stakedLoriaAmount.toString(), "mwei"));
      setUnClaimedDoge(web3.utils.fromWei(rewardDogeAmount.toString(), "gwei"));
      setUnClaimedLoria(web3.utils.fromWei(rewardLoriaAmount.toString(), "mwei"));
   }

   return (
      <React.Fragment>
         {isLoading && <Loading />}
         <div className="gray-bg ms p-4 mb-4 mb-md-0">
            <div className="acc-heading-text ms">
               <h6 className="mb-3">Account balance</h6>
               <h2>{dogeB} <span>MSDOGE</span></h2>
               <h4 className="mb-2"><span style={{ color: "#F7CE0E" }} className="text-bold">{loriaB}</span> <span style={{ fontWeight: "500" }}>CRYPTO</span></h4>
               <h4 className="mt-3">{ethB} <span>ETH</span></h4>
            </div>
            <div className="withdraw-text ms mt-2">
               <div className="row border-top">
                  <div className="col-6 py-2">
                     <h3>{_stakedDoge} <span>MSDOGE</span></h3>
                  </div>
                  <div className="col-6 py-2 text-end">
                     <h3><span>Staked in total</span></h3>
                  </div>
               </div>
               <div className="row border-top">
                  <div className="col-6 py-2">
                     <h3>{_stakedLoria} <span>CRYPTO</span></h3>
                  </div>
                  <div className="col-6 py-2 text-end">
                     <h3><span>Staked in total</span></h3>
                  </div>
               </div>
               <div className="row border-top">
                  <div className="col-6 py-2">
                     <h3>{_unClaimedDoge} <span>MSDOGE</span></h3>
                  </div>
                  <div className="col-6 py-2 text-end">
                     <h3><span>Unclaimed reward</span></h3>
                  </div>
               </div>
               <div className="row border-top">
                  <div className="col-6 py-2">
                     <h3>{_unClaimedLoria} <span>CRYPTO</span></h3>
                  </div>
                  <div className="col-6 py-2 text-end">
                     <h3><span>Unclaimed reward</span></h3>
                  </div>
               </div>
               {/* <div className="row justify-content-center border-top">
                  <div className="col-6 py-3 text-center">
                     <button
                        type="button"
                        className={`withdraw-btn mx-auto py-3 px-5 ${active && "active"}`}
                        {
                           ...(
                              active && {
                                 "data-bs-target" : "#stakingModal",
                                 "data-bs-toggle" : "modal"
                              }
                           )
                        }
                     >
                     Stake
                     </button>
                  </div>
               </div> */}
               <div className="row border-top">
                  <div className="col-6 py-3 text-center">
                     <button
                        type="button"
                        className="withdraw-btn mx-auto py-3 px-5"
                        {
                        ...(
                           active && {
                              "data-bs-target": "#cancelStake",
                              "data-bs-toggle": "modal"
                           }
                        )
                        }
                     >
                        Unstake
                     </button>
                  </div>
                  <div className="col-6 py-3 text-center">
                     <button
                        type="button"
                        className="withdraw-btn mx-auto py-3 px-5"
                        data-bs-toggle="modal" data-bs-target="#stakeCryptoModal"
                        {
                        ...(
                           active && {
                              "data-bs-target": "#multiClaimCoinPopup",
                              "data-bs-toggle": "modal"
                           }
                        )
                        }
                     >
                        Claim
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Modal */}

         <div className="modal fade" id="cancelStake" tabIndex="-1" aria-labelledby="cancelStake" aria-hidden="true">
            <div className="modal-dialog">
               <div className="modal-content">
                  <div className="modal-body popup-card-container rel">
                     <button type="button" className="closebtn" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">Stake Settings</h5>
                        <form action="">
                           <div className="input-bal">
                              <div className="row">

                                 <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small>Pool Stake 1: </small></div>
                                    <div><small><b>{_stakedDoge}</b> MSDOGE</small></div>
                                 </div>

                                 <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small>Pool Stake 2: </small></div>
                                    <div><small><b>{_stakedLoria}</b> CRYPTO</small></div>
                                 </div>

                                 <div className="col-sm-12">
                                    <div className="p-2 stake-btn">
                                       <button
                                          type="button"
                                          className="table-btn color5 py-2 px-4 w-100 mb-3 text-white"
                                          onClick={withdraw}
                                       >Cancel Stake</button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Modal */}

         <div className="modal fade" id="multiClaimCoinPopup" tabIndex="-1" aria-labelledby="multiClaimCoinPopup" aria-hidden="true">
            <div className="modal-dialog">
               <div className="modal-content">
                  <div className="modal-body popup-card-container rel">
                     <button type="button" className="closebtn" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">Claim</h5>
                        <form action="">
                           <div className="input-bal">
                              <div className="row">
                                 <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small>Pool Reward 1</small></div>
                                    <div><small>{_unClaimedDoge} MSDODGE</small></div>
                                 </div>

                                 <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small>Pool Reward 2</small></div>
                                    <div><small>{_unClaimedLoria} CRYPTO</small></div>
                                 </div>

                                 {/* <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small>Pool Penalty</small></div>
                                    <div><small>0.000</small></div>
                                 </div> */}
                                 <div className="col-sm-12">
                                    <div className="p-2 stake-btn">
                                       <button
                                          type="button"
                                          className="table-btn btn py-2 px-4 w-100 mb-3"
                                          onClick={multipleClaim}
                                       >Claim</button>
                                       {/* <div className="claim-btn-failed color5 py-2 px-4 w-100 text-center"><b>Transcation failed</b></div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>


         {/*** Stake Crypto Modal - 1 ***/}
         <div className="modal fade" id="stakeCryptoModal" tabIndex="-1" aria-labelledby="stakeCryptoModalLabel" aria-hidden="true">
            <div className="modal-dialog">
               <div className="modal-content icon-text-block-cri">
                  <div className="modal-body popup-card-container rel">
                     <button type="button" className="closebtn" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">Stake</h5>
                        <div action="">
                           <div className="input-bal">
                              <div className="inner-bore p-3">
                                 <div className="row">
                                    <div className="col-6">
                                       <h4 className="mb-3">Stake</h4>
                                    </div>
                                    <div className="col-6 text-end">
                                       <h4 className="mb-3">Balance: {dogeB} CRYPTO</h4>
                                    </div>

                                    <div className="col-sm-12 d-flex justify-content-center flex-column align-items-center">
                                       <div className="crypto-select-icon">
                                          <Dropdown
                                             name="location"
                                             title="Select location"
                                             list={optionData}
                                             onChange={(res) => setCoin(res.value)}
                                             select={{ value: activeCoin }}
                                             styles={{
                                                wrapper: {
                                                   width: '130px'
                                                },
                                                header: {
                                                   border: 'none',
                                                   backgroundColor: 'transparent'
                                                },
                                                headerTitle: {
                                                   fontSize: '15px',
                                                   fontWeight: 'bold',
                                                   alignItems: 'center'
                                                },
                                                scrollList: {
                                                   padding: '10px',
                                                },
                                                listItem: {
                                                   fontSize: '15px',
                                                   fontWeight: 'initial',
                                                   padding: '0',
                                                   overflow: 'initial',
                                                }
                                             }}
                                          />
                                       </div>
                                       <div className="small-logo-photo">
                                          <Dropdown
                                             name="location"
                                             title="Select location"
                                             list={locations}
                                             onChange={(res) => setCoin(res.value)}
                                             styles={{
                                                wrapper: {
                                                   width: '130px'
                                                },
                                                header: {
                                                   borderRadius: '25px',
                                                   backgroundColor: 'transparent'
                                                },
                                                headerTitle: {
                                                   fontSize: '15px',
                                                   fontWeight: 'bold',
                                                   alignItems: 'center'
                                                },
                                                scrollList: {
                                                   padding: '10px',
                                                },
                                                listItem: {
                                                   fontSize: '15px',
                                                   fontWeight: 'initial',
                                                   padding: '0',
                                                   overflow: 'initial',
                                                   borderTop: '1px solid #eee'
                                                }
                                             }}
                                             select={{ value: activeCoin }}
                                          />
                                       </div>
                                       <div className="mt-2">
                                          <input
                                             type="number"
                                             className="input-box text-center"
                                             placeholder="0.5"
                                             onChange={(e) => setStakingAmount(e.target.value)}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="row mt-5">
                                 <div className="col-12">
                                    <div className="apy-box rel px-3 py-4 text-center">
                                       <h4 className="green-box">0.5% APY</h4>
                                       <p>The APY is calculated by multiplying the amount of months staked with 0.5. Maximum of 20% APY. Please note that cancelling the stake early will penalize you. Refer to our documentation: <a href="#" className="click-btn">Click Here</a> </p>
                                    </div>
                                    <button
                                       className="mt-3 approve-btn text-white text-center py-4 w-100"
                                       onClick={Staking}
                                    >Approve 0.5 CRYPTO</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </React.Fragment>
   )
}

const mapDispatchToProps = (dispatch) => ({
   updateStatus: () => dispatch(updateStatus())
})
export default connect(null, mapDispatchToProps)(AccountBalance);