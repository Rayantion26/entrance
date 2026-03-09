import { addLog } from './store';

export type Role = 'Student' | 'Teacher';

/**
 * AccessCard Class
 * Represents a physical or digital access card used to open gates.
 */
export class AccessCard {
  public CardID: string;
  public IsActive: boolean;
  public AssignedUserID: string;
  public Role: Role;

  constructor(CardID: string, IsActive: boolean, AssignedUserID: string, Role: Role) {
    this.CardID = CardID;
    this.IsActive = IsActive;
    this.AssignedUserID = AssignedUserID;
    this.Role = Role;
  }

  ActivateCard(): void {
    this.IsActive = true;
  }

  DeactivateCard(): void {
    this.IsActive = false;
  }
}

/**
 * AccessGate Class
 * Represents a physical gate that reads access cards and opens/closes.
 */
export class AccessGate {
  public GateID: string;
  public Location: string;
  public GateStatus: 'Open' | 'Closed' | 'Alarm';
  public AllowedRoles: Role[];

  // Callback to notify the UI of status changes
  private onStatusChange?: (status: string, message: string) => void;

  constructor(GateID: string, Location: string, AllowedRoles: Role[], onStatusChange?: (status: string, message: string) => void) {
    this.GateID = GateID;
    this.Location = Location;
    this.AllowedRoles = AllowedRoles;
    this.GateStatus = 'Closed';
    this.onStatusChange = onStatusChange;
  }

  ReadCard(card: AccessCard): boolean {
    const timestamp = new Date().toISOString();

    if (!card.IsActive) {
      this.TriggerAlarm("Inactive card");
      addLog({ UserID: card.AssignedUserID, GateID: this.GateID, Timestamp: timestamp, Outcome: 'Denied', Reason: 'Inactive card' });
      return false;
    }

    if (!this.AllowedRoles.includes(card.Role)) {
      this.TriggerAlarm("Unauthorized role");
      addLog({ UserID: card.AssignedUserID, GateID: this.GateID, Timestamp: timestamp, Outcome: 'Denied', Reason: 'Unauthorized role' });
      return false;
    }

    this.OpenGate();
    addLog({ UserID: card.AssignedUserID, GateID: this.GateID, Timestamp: timestamp, Outcome: 'Granted' });
    return true;
  }

  OpenGate(): void {
    this.GateStatus = 'Open';
    if (this.onStatusChange) {
      this.onStatusChange(this.GateStatus, `Gate ${this.GateID} at ${this.Location} opened successfully.`);
    }
  }

  CloseGate(): void {
    this.GateStatus = 'Closed';
    if (this.onStatusChange) {
      this.onStatusChange(this.GateStatus, `Gate ${this.GateID} at ${this.Location} closed.`);
    }
  }

  TriggerAlarm(reason: string = "Invalid or inactive card"): void {
    this.GateStatus = 'Alarm';
    if (this.onStatusChange) {
      this.onStatusChange(this.GateStatus, `ALARM TRIGGERED at Gate ${this.GateID} (${this.Location})! ${reason}.`);
    }
  }
}

/**
 * User Class (Parent)
 * Represents a generic user in the campus system.
 */
export class User {
  public Name: string;
  public UserID: string;
  public Department: string;
  public Card: AccessCard;

  constructor(Name: string, UserID: string, Department: string, Card: AccessCard) {
    this.Name = Name;
    this.UserID = UserID;
    this.Department = Department;
    this.Card = Card;
  }

  SwipeCard(gate: AccessGate): void {
    gate.ReadCard(this.Card);
  }
}

/**
 * Student Class (Child of User)
 * Inherits from User and adds student-specific attributes and methods.
 */
export class Student extends User {
  public GradeLevel: string;
  public Major: string;

  constructor(Name: string, UserID: string, Department: string, Card: AccessCard, GradeLevel: string, Major: string) {
    super(Name, UserID, Department, Card);
    this.GradeLevel = GradeLevel;
    this.Major = Major;
  }

  RegisterForClasses(): string {
    return `${this.Name} has registered for classes in ${this.Major}.`;
  }
}

/**
 * Teacher Class (Child of User)
 * Inherits from User and adds teacher-specific attributes and methods.
 */
export class Teacher extends User {
  public FacultyRank: string;
  public OfficeRoom: string;

  constructor(Name: string, UserID: string, Department: string, Card: AccessCard, FacultyRank: string, OfficeRoom: string) {
    super(Name, UserID, Department, Card);
    this.FacultyRank = FacultyRank;
    this.OfficeRoom = OfficeRoom;
  }

  AssignGrades(): string {
    return `${this.Name} is assigning grades for the ${this.Department} department.`;
  }
}
