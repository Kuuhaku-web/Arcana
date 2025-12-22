// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampusToken
 * @dev Token ERC20 untuk Arcana Campus
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract CampusToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => uint256) public academicPoints;

    uint256 private _totalSupply;
    string public name = "Arcana";
    string public symbol = "ARC";
    uint8 public decimals = 18;

    address public owner;

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event AcademicPointsAwarded(address indexed student, uint256 points);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        _totalSupply = initialSupply * 10 ** uint256(decimals);
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        emit TokensTransferred(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address _owner, address spender) public view returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(_balances[sender] >= amount, "Insufficient balance");
        require(_allowances[sender][msg.sender] >= amount, "Allowance exceeded");
        
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        
        emit Transfer(sender, recipient, amount);
        emit TokensTransferred(sender, recipient, amount);
        return true;
    }

    function mint(address to, uint256 amount, string memory reason) public onlyOwner {
        uint256 amountInWei = amount * 10 ** uint256(decimals);
        _totalSupply += amountInWei;
        _balances[to] += amountInWei;
        emit Transfer(address(0), to, amountInWei);
        emit TokensMinted(to, amount, reason);
    }

    function awardAcademicPoints(address student, uint256 points) public onlyOwner {
        academicPoints[student] += points;
        emit AcademicPointsAwarded(student, points);
    }

    function rewardStudent(address student, uint256 tokenAmount) public onlyOwner {
        require(academicPoints[student] > 0, "Student has no academic points");
        mint(student, tokenAmount, "Academic Achievement Reward");
    }

    function getAcademicPoints(address student) public view returns (uint256) {
        return academicPoints[student];
    }

    function getReadableBalance(address account) public view returns (uint256) {
        return _balances[account] / 10 ** uint256(decimals);
    }
}
