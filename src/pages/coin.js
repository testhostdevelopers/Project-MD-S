import AccountBalanceStake from '../components/AccountBalance';
import AcountBalanceBonds from '../components/AcountBalanceBonds';
import Footer from '../components/layout/Footer';
import Navbar from "../components/layout/Navbar";
import ListOfStakes from '../components/ListOfStakes';
import ListOfBounds from '../components/ListOfBounds';
import TotalMarketInfo from '../components/TotalMarketInfo/index';
import { useState } from 'react/cjs/react.development';

export default function Coin() {

    const [stakeBalance, setStakeBalance] = useState(false)

    //data-bs-toggle="modal" data-bs-target="#exampleModal"
    return (
        <>
            <Navbar />
            <div className="coin-main py-60 ms">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-md-12">
                            <TotalMarketInfo />
                        </div>
                        <div className="col-md-5 col-lg-4">

                            {
                                stakeBalance === false ?  <AccountBalanceStake /> : <AcountBalanceBonds />
                            }

                        </div>
                        <div className="col-md-7 col-lg-8">
                            <div className="d-flex justify-content-between">
                                <div className="heading-text-stake ms">
                                    <h2>MsDoge Staking</h2>
                                    <p>List of stakes below</p>
                                </div>
                                <div className="d-flex">
                                    <div className={stakeBalance === false ? "stake-btn" : "stake-btn-outline"}> 
                                        <a className="btn" onClick={() => setStakeBalance(false)}>Stake</a>
                                    </div>

                                    <div className={stakeBalance === false ? "stake-btn-outline" : "stake-btn"}>
                                        <a className="btn" onClick={() => setStakeBalance(true)} >Bonds</a>
                                    </div>

                                    <div className="stake-btn-outline">
                                        <a className="btn" data-bs-toggle="modal" data-bs-target="#msDogeApprove">Migrate</a>
                                    </div>
                                </div>
                            </div>

                            {
                                stakeBalance === false ? <ListOfStakes /> :  <ListOfBounds />
                            }

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
