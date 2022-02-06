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

const duration = 24 * 3600;
const locations = [
   {
      label: <span><img src={cryptoLogo} width="20px" height="20px" /> CRYPTO</span>,
      value: 1,
   },
   {
      label: <span><img src={slogo} width="20px" height="20px" /> MSDOGE</span>,
      value: 0,
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

   useEffect(async (preprops) => {
      if (preprops != props && account && _Staking) await getStakedList();
   }, [props])

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
         let amount = 0;
         let balance, rewardB;
         switch (activeCoin) {
            case 0:
               amount = web3.utils.toWei(_stakingAmount.toString(), "gwei");
               balance = await _MSDOGE.methods.balanceOf(account).call();
               rewardB = await _XMSDOGE.methods.balanceOf(StakingAddress).call();
               if (Number(balance) < Number(amount)) throw "Not enough balance";
               else if (Number(rewardB) < Number(amount)) throw "Not enough reward balance";
               await _MSDOGE.methods.approve(StakingAddress, amount).send({ from: account });
               NotificationManager.info("Approved", "Info");
               break;
            case 1:
               amount = web3.utils.toWei(_stakingAmount.toString(), "mwei");
               balance = await _CRYPTO.methods.balanceOf(account).call();
               rewardB = await _XCRYPTO.methods.balanceOf(StakingAddress).call();
               if (Number(balance) < Number(amount)) throw "Not enough balance";
               else if (Number(rewardB) < Number(amount)) throw "Not enough reward balance";
               await _CRYPTO.methods.approve(StakingAddress, amount).send({ from: account });
               NotificationManager.info("Approved", "Info");
               break;
         }
         await _Staking.methods.stake(activeCoin, amount, counter).send({ from: account })
            .on('receipt', async (receipt) => {
               NotificationManager.success("Success", ":)");
               await props.updateStatus();
               await getStakedList();
            })
      } catch (err) {
         if (typeof err == "string") NotificationManager.error(err);
         else NotificationManager.error("Failed");
      }
      setLoading(false);
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

         let count = Math.floor((now - updated_at) / (duration * item._dogeEli));
         // let count = 1;

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

               <div className="row border-top">
                  <div className="col-12 py-3 text-center">
                     <button
                        type="button"
                        className={`withdraw-btn mx-auto py-3 px-5 ${active && "active"}`}
                        data-bs-toggle="modal" data-bs-target="#stakeCryptoModal"
                        {
                        ...(
                           active && {
                              "data-bs-target": "#stakingModal",
                              "data-bs-toggle": "modal"
                           }
                        )
                        }
                     >
                        Stake
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Modal */}
         <div className="modal fade" id="stakingModal" tabIndex="-1" aria-labelledby="stakingModalLabel" aria-hidden="true">
            <div className="modal-dialog">
               <div className="modal-content icon-text-block-cri">
                  <div className="modal-body popup-card-container rel">
                     <button type="button" className="closebtn" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">Transactions</h5>
                        <div action="">
                           <div className="input-bal">
                              <div className="inner-bore p-3">
                                 <div className="row">
                                    <div className="col-6">
                                       <h4 className="mb-3">Input</h4>
                                    </div>
                                    <div className="col-6 text-end">
                                       <h4 className="mb-3">Balance: {dogeB} MSDOGE</h4>
                                    </div>

                                    <div className="col-12 d-flex flex-column align-items-center justify-content-center">
                                       <div className="small-logo-photo mb-3">
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

                                       <input
                                          type="number"
                                          className="input-box"
                                          placeholder="0.5"
                                          onChange={(e) => setStakingAmount(e.target.value)}
                                       />

                                    </div>
                                 </div>
                              </div>
                              {/* <div className="row my-3">
                                 <div className="col-md-5">
                                    <div className="d-flex align-items-center sel-number-box">
                                       <div className="number me-3 d-flex justify-content-between">
                                          <span className="minus" onClick={(counter > 1 ? () => setCounter(counter - 1) : () => null)}>
                                             <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.75 0.25H11.25V1.75H0.75V0.25Z" fill="#161F2F" />
                                             </svg>
                                          </span>
                                          <input type="text" value={counter} readOnly />
                                          <span className="plus" onClick={() => counter < 84 && setCounter(counter + 1)}>
                                             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.25 5.25V0.75H6.75V5.25H11.25V6.75H6.75V11.25H5.25V6.75H0.75V5.25H5.25Z" fill="#161F2F" />
                                             </svg>
                                          </span>
                                       </div>
                                       <p>Months</p>
                                    </div>
                                 </div>
                              </div> */}
                              <div className="row mt-5">
                                 <div className="col-12">
                                    {/* <div className="d-flex mb-5 qu-text">
                                       <div className="icon-box me-2 d-flex">
                                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path fillRule="evenodd" clipRule="evenodd" d="M1.5 9C1.5 13.1423 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1423 16.5 9C16.5 4.85775 13.1423 1.5 9 1.5C4.85775 1.5 1.5 4.85775 1.5 9ZM15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9ZM9.75 11.25V12.75H8.25V11.25H9.75ZM9.75029 10.5V10.0162C10.983 9.64878 11.7681 8.44242 11.6048 7.16651C11.4415 5.8906 10.3779 4.92085 9.09237 4.87572C7.80685 4.83059 6.6779 5.72339 6.42554 6.9847L7.89704 7.27945C8.01319 6.69834 8.56023 6.30696 9.14773 6.38467C9.73522 6.46237 10.1617 6.9825 10.1228 7.57383C10.0839 8.16517 9.5929 8.62492 9.00029 8.62495C8.58607 8.62495 8.25029 8.96074 8.25029 9.37495V10.5H9.75029Z" fill="#171717" />
                                          </svg>
                                       </div>
                                       You can stake from 1 month to 7 years.
                                    </div> */}
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
                     <button type="button" className="closebtn p-0" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div data-bs-toggle="modal" data-bs-target="#" className="cursor-pointer position-absolute" style={{ right: "15px", top: "15px" }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M11.8194 20H8.1794C7.95133 20 7.7301 19.9221 7.5524 19.7792C7.3747 19.6362 7.2512 19.4368 7.2024 19.214L6.7954 17.33C6.25245 17.0921 5.73763 16.7946 5.2604 16.443L3.4234 17.028C3.20596 17.0973 2.97135 17.0902 2.75852 17.0078C2.54569 16.9254 2.36745 16.7727 2.2534 16.575L0.429396 13.424C0.316541 13.2261 0.274179 12.9958 0.309238 12.7708C0.344298 12.5457 0.454705 12.3392 0.622396 12.185L2.0474 10.885C1.98259 10.2961 1.98259 9.70189 2.0474 9.113L0.622396 7.816C0.454467 7.66177 0.343911 7.45507 0.308845 7.22978C0.273779 7.00449 0.316285 6.77397 0.429396 6.576L2.2494 3.423C2.36345 3.22532 2.54169 3.07259 2.75452 2.99019C2.96735 2.90778 3.20196 2.90066 3.4194 2.97L5.2564 3.555C5.5004 3.375 5.7544 3.207 6.0164 3.055C6.2694 2.913 6.5294 2.784 6.7954 2.669L7.2034 0.787C7.25197 0.564198 7.37523 0.364688 7.55274 0.221549C7.73026 0.0784098 7.95136 0.000239966 8.1794 0H11.8194C12.0474 0.000239966 12.2685 0.0784098 12.446 0.221549C12.6236 0.364688 12.7468 0.564198 12.7954 0.787L13.2074 2.67C13.4874 2.794 13.7614 2.933 14.0264 3.088C14.2734 3.231 14.5124 3.388 14.7424 3.557L16.5804 2.972C16.7977 2.90292 17.0321 2.91017 17.2447 2.99256C17.4573 3.07495 17.6354 3.22753 17.7494 3.425L19.5694 6.578C19.8014 6.985 19.7214 7.5 19.3764 7.817L17.9514 9.117C18.0162 9.70589 18.0162 10.3001 17.9514 10.889L19.3764 12.189C19.7214 12.507 19.8014 13.021 19.5694 13.428L17.7494 16.581C17.6353 16.7787 17.4571 16.9314 17.2443 17.0138C17.0314 17.0962 16.7968 17.1033 16.5794 17.034L14.7424 16.449C14.2655 16.8003 13.751 17.0975 13.2084 17.335L12.7954 19.214C12.7466 19.4366 12.6233 19.6359 12.4458 19.7788C12.2683 19.9218 12.0473 19.9998 11.8194 20V20ZM9.9954 6C8.93453 6 7.91711 6.42143 7.16697 7.17157C6.41682 7.92172 5.9954 8.93913 5.9954 10C5.9954 11.0609 6.41682 12.0783 7.16697 12.8284C7.91711 13.5786 8.93453 14 9.9954 14C11.0563 14 12.0737 13.5786 12.8238 12.8284C13.574 12.0783 13.9954 11.0609 13.9954 10C13.9954 8.93913 13.574 7.92172 12.8238 7.17157C12.0737 6.42143 11.0563 6 9.9954 6V6Z" fill="black" />
                        </svg>
                     </div>

                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">Stake</h5>
                        <div>

                           <div className="mt-4 heading-text-popupm d-flex justify-content-between">
                              <div className="w-100 text-center">
                                 <h5 style={{ fontSize: "14px" }}>
                                    Balance
                                 </h5>
                                 <h3><b className="text-gold size-19">$100</b></h3>
                              </div>

                              <div className="w-100 text-center">
                                 <h5 style={{ fontSize: "14px" }}>
                                    Stake APR
                                 </h5>
                                 <h3><b className="text-gold size-19">10%</b></h3>
                              </div>
                           </div>

                           <div className="w-100 mt-3">
                              <div className="d-flex justify-content-between w-100 mb-3">
                                 <h5 className="size-14">
                                    Your Balance
                                 </h5>
                                 <h5 className="size-14">
                                    $500
                                 </h5>
                              </div>

                              <div className="d-flex justify-content-between w-100 mb-3">
                                 <h5 className="size-14">
                                    You will get <small>(this month)</small>
                                 </h5>
                                 <h5 className="size-14">
                                    $500 <b className="text-gold">+ $50</b>
                                 </h5>
                              </div>

                              <div className="d-flex justify-content-between w-100 mb-3">
                                 <h5 className="size-14">
                                    This Month’s Bonus
                                 </h5>
                                 <h5 className="size-14">
                                    10%
                                 </h5>
                              </div>

                              <div className="d-flex justify-content-between w-100 mb-3">
                                 <h5 className="size-14">
                                    Vesting Term
                                 </h5>
                                 <h5 className="size-14">
                                    5 days
                                 </h5>
                              </div>
                           </div>

                           <div className="d-flex justify-content-between">
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
                              <div className="mt-2 stake-input-crypto">
                                 <input
                                    type="number"
                                    className="input-box text-center"
                                    placeholder="0.5"
                                    onChange={(e) => setStakingAmount(e.target.value)}
                                 />
                              </div>
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

      </React.Fragment>
   )
}

const mapStateToProps = ({ changed }) => ({
   updated: changed.updated
})

const mapDispatchToProps = (dispatch) => ({
   updateStatus: () => dispatch(updateStatus())
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountBalance);