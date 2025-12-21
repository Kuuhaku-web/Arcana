// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampusToken
 * @dev Token ERC20 untuk aplikasi Decentralized Campus
 */
contract CampusToken is ERC20, Ownable {
    // Decimal places untuk token (default 18)
    uint8 private _decimals = 18;
    
    // Mapping untuk track academic achievements
    mapping(address => uint256) public academicPoints;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event AcademicPointsAwarded(address indexed student, uint256 points);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Constructor - Deploy token dengan supply awal
     * @param initialSupply Jumlah token awal (dalam satuan token, bukan wei)
     */
    constructor(uint256 initialSupply) ERC20("Arcana", "ARC") Ownable(msg.sender) {
        // Mint initial supply ke deployer (dalam wei)
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Mint token baru (hanya owner yang bisa)
     * @param to Address penerima token
     * @param amount Jumlah token yang di-mint
     * @param reason Alasan minting (untuk tracking)
     */
    function mint(address to, uint256 amount, string memory reason) public onlyOwner {
        _mint(to, amount * 10 ** decimals());
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Award academic points ke student
     * @param student Address student
     * @param points Jumlah points
     */
    function awardAcademicPoints(address student, uint256 points) public onlyOwner {
        academicPoints[student] += points;
        emit AcademicPointsAwarded(student, points);
    }

    /**
     * @dev Reward student dengan token berdasarkan academic points
     * @param student Address student
     * @param tokenAmount Jumlah token reward
     */
    function rewardStudent(address student, uint256 tokenAmount) public onlyOwner {
        require(academicPoints[student] > 0, "Student has no academic points");
        _mint(student, tokenAmount * 10 ** decimals());
        emit TokensMinted(student, tokenAmount, "Academic Achievement Reward");
    }

    /**
     * @dev Get academic points untuk address tertentu
     * @param student Address student
     * @return Jumlah academic points
     */
    function getAcademicPoints(address student) public view returns (uint256) {
        return academicPoints[student];
    }

    /**
     * @dev Override transfer untuk emit custom event
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        bool success = super.transfer(to, amount);
        if (success) {
            emit TokensTransferred(msg.sender, to, amount);
        }
        return success;
    }

    /**
     * @dev Get balance dalam format readable (bukan wei)
     * @param account Address yang ingin dicek
     * @return Balance dalam satuan token
     */
    function getReadableBalance(address account) public view returns (uint256) {
        return balanceOf(account) / 10 ** decimals();
    }
}