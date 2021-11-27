import React from 'react'
import AccountBalance from '../components/AccountBalance';
import Footer from '../components/layout/Footer';
import Navbar from "../components/layout/Navbar";
import ListOfStakes from '../components/ListOfStakes';
import TotalMarketInfo from '../components/TotalMarketInfo/index';

const adminDashboard = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="coin-main py-60 ms">
                <div className="container-lg">
                    <div className="row d-flex gray-bg justify-content-center admin-dash_container">
                        <div className="col-sm-12 col-lg-5 d-flex justify-content-center align-items-center flex-column">
                            <div className="admin_amend_inputs">
                                <div className="inputs">
                                    <span>MsDoge APY (%)</span>
                                    <input placeholder="2" />
                                </div>

                                <button className="amend passive">Amend</button>
                            </div>

                            <div className="admin_amend_inputs">
                                <div className="inputs">
                                    <span>Cryptoloria APY (%)</span>
                                    <input placeholder="2" />
                                </div>

                                <button className="amend passive">Amend</button>
                            </div>

                            <div className="admin_amend_inputs">
                                <div className="inputs">
                                    <span>MSDOGE Staking Eligibility (Days)</span>
                                    <input placeholder="2" />
                                </div>

                                <button className="amend passive">Amend</button>
                            </div>

                            <div className="admin_amend_inputs">
                                <div className="inputs">
                                    <span>LORIA Staking Eligibility (Days)</span>
                                    <input placeholder="2" />
                                </div>

                                <button className="amend active" data-bs-toggle="modal" data-bs-target="#stakingAmendment">Amend</button>
                            </div>

                            <div className="admin_amend_inputs">
                                <div className="inputs">
                                    <label class="custom-file-upload">
                                        <input type="file" />
                                        Claim List
                                        <button className="amend passive">Browse</button>
                                    </label>

                                </div>
                                <button className="amend passive">Deploy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Modal */}

         <div class="modal fade" id="stakingAmendment" tabindex="-1" aria-labelledby="stakingAmendment" aria-hidden="true">
            <div class="modal-dialog">
               <div class="modal-content">
                  <div class="modal-body popup-card-container rel">
                     <button type="button" class="closebtn" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                     </button>
                     <div className="heading-text-popupm">
                        <h5 className="my-3 text-center ">MsDoge Staking Amendment</h5>
                        <form action="">
                           <div className="input-bal">
                              <div className="row">
                                 <div className="mb-4 col-sm-12 d-flex justify-content-between">
                                    <div><small><b>Cryptoloria APY (%)</b></small></div>
                                    <div><small>360</small></div>
                                 </div>

                                 <div className="col-sm-12">
                                    <div className="p-2 stake-btn">
                                       <button type="button" className="table-btn btn py-2 px-4 w-100 mb-3">Amend</button>
                                       <div class="closebtn" data-bs-dismiss="modal" aria-label="Close" className="claim-btn-failed color5 py-2 px-4 w-100 text-center"><b>Cancel</b></div>
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
        </React.Fragment>
    )
}

export default adminDashboard
